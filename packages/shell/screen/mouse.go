package screen

import (
	"syscall"
)

const (
	MOUSEEVENTF_LEFTDOWN = 0x0002
	MOUSEEVENTF_LEFTUP = 0x0004
)

var (
	moduser32 = syscall.NewLazyDLL("user32.dll")
	procMouse = moduser32.NewProc("mouse_event")
	procSetCursorPos = moduser32.NewProc("SetCursorPos")
)

func MouseClick(x int32, y int32) {
	procSetCursorPos.Call(uintptr(x), uintptr(y))
	procMouse.Call(uintptr(MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_LEFTUP), 0, 0, 0, 0)
}
