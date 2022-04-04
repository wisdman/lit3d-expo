import { FindHomography } from "../math/homography.mjs"
import { ProcessVectorArray } from "../math/process.mjs"

import { DEFAULT_RESOLUTION } from "../constants.mjs"

const DEFAULT_CORNERS = [
            0           ,           0           , // [0] left-top
  DEFAULT_RESOLUTION[0] ,           0           , // [1] right-top
  DEFAULT_RESOLUTION[0] , DEFAULT_RESOLUTION[1] , // [2] right-bottom
            0           , DEFAULT_RESOLUTION[1] , // [3] left- bottom
]

export class Frame extends EventTarget {
  #id = undefined
  get id() { return this.#id }

  #size = [...DEFAULT_RESOLUTION]

  get size() { return [...this.#size] }
  set size([width, height = width]) {
    this.#size = [width, height]
    this.#change()
  }

  get srcCords() {
    const [width, height] = this.#size
    return [
        0   ,    0   , // [0] left-top
      width ,    0   , // [1] right-top
      width , height , // [2] right-bottom
        0   , height , // [3] left- bottom
    ]
  }

  #corners = [...DEFAULT_CORNERS]

  get corners() { return [...this.#corners] }
  set corners(arr) {
    this.#corners = [...arr]
    this.#change()
  }

  getCorner(i) {
    const x = this.#corners[i * 2 + 0]
    const y = this.#corners[i * 2 + 1]
    return [x, y]
  }

  get homographyMatrix() {
    return FindHomography(this.srcCords, this.corners)
  }

  get srcPositions() {
    const srcCords = this.srcCords
    return [
      srcCords[0 * 2 + 0], srcCords[0 * 2 + 1], 0, 1, // [0] left-top
      srcCords[1 * 2 + 0], srcCords[1 * 2 + 1], 0, 1, // [1] right-top
      srcCords[2 * 2 + 0], srcCords[2 * 2 + 1], 0, 1, // [2] right-bottom

      srcCords[0 * 2 + 0], srcCords[0 * 2 + 1], 0, 1, // [0] left-top
      srcCords[2 * 2 + 0], srcCords[2 * 2 + 1], 0, 1, // [2] right-bottom
      srcCords[3 * 2 + 0], srcCords[3 * 2 + 1], 0, 1, // [3] left- bottom
    ]
  }

  get dstPositions() {
    return ProcessVectorArray(this.homographyMatrix, this.srcPositions)
  }

  #texture = [
    0, // ID
    0, // X
    0, // Y
    1, // width
    1, // height
  ]
  get texture() {
    return [...this.#texture]
  }
  set texture([id = 0, tx = 0, ty = 0, tw = 1, th = 1] = []) {
    this.#texture = [id, tx, ty, tw, th]
    this.#change()
  }

  get textureId() { return this.#texture[0] }
  set textureId(id) {
    this.#texture[0] = id
    this.#change()
  }

  get texcoords() {
    const [, x, y, w, h] = this.#texture
    return [
        x   ,   y   , // [0] left-top
      x + w ,   y   , // [1] right-top
      x + w , y + h , // [2] right-bottom
        x   , y + h , // [3] left- bottom
    ]
  }

  set texcoords([tx = 0, ty = 0, tw = 1, th = 1] = []) {
    const [id] = this.#texture
    this.#texture = [id, tx, ty, tw, th]
    this.#change()
  } 

  get dstTexcoords() {
    const texcoords = this.texcoords
    return [
      texcoords[0 * 2 + 0], texcoords[0 * 2 + 1], // [0] left-top
      texcoords[1 * 2 + 0], texcoords[1 * 2 + 1], // [1] right-top
      texcoords[2 * 2 + 0], texcoords[2 * 2 + 1], // [2] right-bottom

      texcoords[0 * 2 + 0], texcoords[0 * 2 + 1], // [0] left-top
      texcoords[2 * 2 + 0], texcoords[2 * 2 + 1], // [2] right-bottom
      texcoords[3 * 2 + 0], texcoords[3 * 2 + 1], // [3] left- bottom
    ]
  }

  #mask = [
    0, // ID
    0, // X
    0, // Y
    1, // width
    1, // height
  ]
  get mask() {
    return [...this.#mask]
  }
  set mask([id = 0, tx = 0, ty = 0, tw = 1, th = 1] = []) {
    this.#mask = [id, tx, ty, tw, th]
    this.#change()
  }

  get maskId() { return this.#mask[0] }
  set maskId(id) {
    this.#mask[0] = id
    this.#change()
  }

  get maskcoords() {
    const [, x, y, w, h] = this.#mask
    return [
        x   ,   y   , // [0] left-top
      x + w ,   y   , // [1] right-top
      x + w , y + h , // [2] right-bottom
        x   , y + h , // [3] left- bottom
    ]
  }

  set maskcoords([tx = 0, ty = 0, tw = 1, th = 1] = []) {
    const [id] = this.#mask
    this.#mask = [id, tx, ty, tw, th]
    this.#change()
  }

  get dstMaxcoords() {
    const mask = this.mask
    return [
      mask[0 * 2 + 0], mask[0 * 2 + 1], // [0] left-top
      mask[1 * 2 + 0], mask[1 * 2 + 1], // [1] right-top
      mask[2 * 2 + 0], mask[2 * 2 + 1], // [2] right-bottom

      mask[0 * 2 + 0], mask[0 * 2 + 1], // [0] left-top
      mask[2 * 2 + 0], mask[2 * 2 + 1], // [2] right-bottom
      mask[3 * 2 + 0], mask[3 * 2 + 1], // [3] left- bottom
    ]
  }

  #change = () => this.dispatchEvent(new Event("change"))

  toJSON() {
    return {
      id: this.#id,
      corners: this.corners,
      size: this.size,
      texture: this.#texture,
      mask: this.#mask,
    }
  }

  constructor(id, {
    size: [width = DEFAULT_RESOLUTION[0], height = DEFAULT_RESOLUTION[1]] = [],
    corners = DEFAULT_CORNERS,
    texture: [texId = 0, tx = 0, ty = 0, tw = 1, th = 1] = [],
    mask: [maskId = 0, mx = 0, my = 0, mw = 1, mh = 1] = [], 
  } = {}) {
    super()
    this.#id = id

    this.#size = [width, height]
    this.#corners = [...corners]
    this.#texture = [texId, tx, ty, tw, th]
    this.#mask = [maskId, mx, my, mw, mh]
  }

  move = (dx, dy) => {
    const [
      ltx, lty, // [0] left-top
      rtx, rty, // [1] right-top
      rbx, rby, // [2] right-bottom
      lbx, lby, // [3] left- bottom
    ] = this.#corners

    this.#corners = [
      ltx + dx, lty + dy, // [0] left-top
      rtx + dx, rty + dy, // [1] right-top
      rbx + dx, rby + dy, // [2] right-bottom
      lbx + dx, lby + dy, // [3] left- bottom
    ]

    this.#change()
  }

  moveCorner = (i, dx, dy) => {
    const x = this.#corners[i * 2 + 0]
    const y = this.#corners[i * 2 + 1]
    
    this.#corners[i * 2 + 0] = x + dx
    this.#corners[i * 2 + 1] = y + dy
    this.#change()
  }
}