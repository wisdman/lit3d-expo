package screen

import (
	"syscall"
)

const (
	MOUSEEVENTF_ABSOLUTE = 0x8000
	MOUSEEVENTF_MOVE = 0x0001

	MOUSEEVENTF_LEFTDOWN = 0x0002
	MOUSEEVENTF_LEFTUP = 0x0004
)

var (
	moduser32 = syscall.NewLazyDLL("user32.dll")
	procMouse = moduser32.NewProc("mouse_event")
)

func MouseClick(intype uint32) {
	procMouse.Call(uintptr(intype), 0, 0, 0, 0)
}

func MouseMove(abs bool, x int32, y int32) {
	var intype uint32 = MOUSEEVENTF_MOVE
	if abs {
		intype |= MOUSEEVENTF_ABSOLUTE
	}
	procMouse.Call(uintptr(intype), uintptr(x), uintptr(y), 0, 0)
}