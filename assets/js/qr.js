/*!
 * QR generator (lightweight) for offline use.
 * Based on well-known QR Code generation techniques (Reed-Solomon ECC).
 * License: MIT.
 *
 * Exposes: window.QR = { toSvg(text, {ecc, scale, border}) }
 */
(() => {
  "use strict";

  // Galois field (256) with primitive polynomial 0x11D
  const gfExp = new Uint8Array(512);
  const gfLog = new Uint8Array(256);
  {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      gfExp[i] = x;
      gfLog[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) gfExp[i] = gfExp[i - 255];
  }

  const gfMul = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return gfExp[gfLog[a] + gfLog[b]];
  };

  const rsGenerator = (degree) => {
    // Start with [1]
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gfMul(poly[j], 1);
        next[j + 1] ^= gfMul(poly[j], gfExp[i]);
      }
      poly = next;
    }
    return poly;
  };

  const rsCompute = (data, eccLen) => {
    const gen = rsGenerator(eccLen);
    const ecc = new Array(eccLen).fill(0);
    for (const byte of data) {
      const factor = byte ^ ecc[0];
      ecc.shift();
      ecc.push(0);
      for (let i = 0; i < eccLen; i++) ecc[i] ^= gfMul(gen[i], factor);
    }
    return ecc;
  };

  const ECC = {
    L: "L",
  };

  // Version 1..4 capacity for byte mode, ECC-L only (enough for tel/mailto and short URLs).
  // Data codewords (bytes) and ECC codewords per block. Single block for versions 1..4 (L).
  const V = {
    1: { size: 21, dataCw: 19, eccCw: 7 },
    2: { size: 25, dataCw: 34, eccCw: 10 },
    3: { size: 29, dataCw: 55, eccCw: 15 },
    4: { size: 33, dataCw: 80, eccCw: 20 },
  };

  const toBits = (bytes) => {
    const out = [];
    for (const b of bytes) for (let i = 7; i >= 0; i--) out.push((b >>> i) & 1);
    return out;
  };

  const pushBits = (arr, val, len) => {
    for (let i = len - 1; i >= 0; i--) arr.push((val >>> i) & 1);
  };

  const makeData = (text, version) => {
    const { dataCw } = V[version];
    const bytes = new TextEncoder().encode(text);
    const bits = [];
    // Mode indicator: byte (0100)
    pushBits(bits, 0b0100, 4);
    // Char count indicator: 8 bits for versions 1..9 in byte mode
    pushBits(bits, bytes.length, 8);
    // Data
    for (const b of bytes) pushBits(bits, b, 8);
    // Terminator
    const maxBits = dataCw * 8;
    const remaining = maxBits - bits.length;
    pushBits(bits, 0, Math.min(4, Math.max(0, remaining)));
    // Pad to byte boundary
    while (bits.length % 8 !== 0) bits.push(0);
    // Pad bytes 0xEC, 0x11
    const out = [];
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      out.push(b);
    }
    const pads = [0xec, 0x11];
    let padIdx = 0;
    while (out.length < dataCw) out.push(pads[padIdx++ % 2]);
    return out;
  };

  const chooseVersion = (text) => {
    const len = new TextEncoder().encode(text).length;
    // Very small heuristic based on byte-mode capacity (ECC-L)
    if (len <= 17) return 1; // after overhead
    if (len <= 32) return 2;
    if (len <= 53) return 3;
    return 4;
  };

  const makeMatrix = (version) => {
    const size = V[version].size;
    const m = Array.from({ length: size }, () => new Array(size).fill(null));
    const set = (r, c, v) => {
      if (r < 0 || c < 0 || r >= size || c >= size) return;
      m[r][c] = v;
    };

    // Finder patterns + separators
    const placeFinder = (r0, c0) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const rr = r0 + r;
          const cc = c0 + c;
          const on =
            r >= 0 &&
            r <= 6 &&
            c >= 0 &&
            c <= 6 &&
            (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          set(rr, cc, on ? 1 : 0);
        }
      }
    };
    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      set(6, i, i % 2 === 0 ? 1 : 0);
      set(i, 6, i % 2 === 0 ? 1 : 0);
    }

    // Dark module
    set(4 * version + 9, 8, 1);

    // Reserve format info areas
    for (let i = 0; i < 9; i++) {
      if (m[8][i] === null) set(8, i, 0);
      if (m[i][8] === null) set(i, 8, 0);
    }
    for (let i = 0; i < 8; i++) {
      if (m[8][size - 1 - i] === null) set(8, size - 1 - i, 0);
      if (m[size - 1 - i][8] === null) set(size - 1 - i, 8, 0);
    }
    set(8, 8, 0);

    return m;
  };

  // Format bits for ECC-L and mask 0 (fixed to keep implementation small)
  // ECC-L (01) + mask 000 => 0b01000 then BCH and XOR 0x5412.
  const formatBitsMask0_EccL = 0b111011111000100; // precomputed final 15 bits for (L, mask 0)

  const placeFormatBits = (m) => {
    const size = m.length;
    const bits = formatBitsMask0_EccL;
    const bit = (i) => (bits >>> i) & 1;
    // Around top-left finder
    for (let i = 0; i <= 5; i++) m[8][i] = bit(14 - i);
    m[8][7] = bit(14 - 6);
    m[8][8] = bit(14 - 7);
    m[7][8] = bit(14 - 8);
    for (let i = 9; i <= 14; i++) m[14 - i][8] = bit(14 - i);
    // Top-right
    for (let i = 0; i < 8; i++) m[8][size - 1 - i] = bit(7 - i);
    // Bottom-left
    for (let i = 0; i < 7; i++) m[size - 1 - i][8] = bit(14 - i);
  };

  const placeData = (m, codewords) => {
    const size = m.length;
    const bits = toBits(codewords);
    let i = 0;
    let dirUp = true;
    for (let col = size - 1; col >= 1; col -= 2) {
      if (col === 6) col--;
      for (let rowOff = 0; rowOff < size; rowOff++) {
        const row = dirUp ? size - 1 - rowOff : rowOff;
        for (let c = 0; c < 2; c++) {
          const cc = col - c;
          if (m[row][cc] !== null) continue;
          const b = bits[i++] ?? 0;
          // Mask 0: (row + col) % 2 === 0
          const masked = ((row + cc) % 2 === 0) ? b ^ 1 : b;
          m[row][cc] = masked;
        }
      }
      dirUp = !dirUp;
    }
  };

  const toSvg = (text, opts = {}) => {
    const ecc = (opts.ecc || ECC.L).toUpperCase();
    if (ecc !== "L") throw new Error("Only ECC-L supported in qr-lite");
    const version = chooseVersion(text);
    const { eccCw } = V[version];
    const data = makeData(text, version);
    const eccBytes = rsCompute(data, eccCw);
    const codewords = data.concat(eccBytes);

    const m = makeMatrix(version);
    placeData(m, codewords);
    placeFormatBits(m);

    const border = Number.isFinite(opts.border) ? opts.border : 2;
    const scale = Number.isFinite(opts.scale) ? opts.scale : 4;
    const size = m.length;
    const dim = (size + border * 2) * scale;
    const rects = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (m[r][c] === 1) {
          const x = (c + border) * scale;
          const y = (r + border) * scale;
          rects.push(`<rect x="${x}" y="${y}" width="${scale}" height="${scale}" />`);
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/>${rects.join("")}</svg>`;
  };

  window.QR = { toSvg, ECC };
})();

