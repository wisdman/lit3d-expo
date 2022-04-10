//go:build windows

package winapi

import (
	"fmt"
	"syscall"
	"time"
	"unsafe"
)

// Windows API functions
var (
	modUser32   		= syscall.NewLazyDLL("user32.dll")
	
	procEnumWindows 				     = modUser32.NewProc("EnumWindows")
	procGetWindow                = modUser32.NewProc("GetWindow")
	procGetWindowRect            = modUser32.NewProc("GetWindowRect")
	procGetWindowText            = modUser32.NewProc("GetWindowTextW")
	procGetWindowTextLength      = modUser32.NewProc("GetWindowTextLengthW")
	procGetWindowThreadProcessId = modUser32.NewProc("GetWindowThreadProcessId")
	procIsWindowVisible          = modUser32.NewProc("IsWindowVisible")
	procMouse 									 = modUser32.NewProc("mouse_event")
	procSendMessage              = modUser32.NewProc("SendMessageW")
	procSetCursorPos 						 = modUser32.NewProc("SetCursorPos")
)

func EnumWindows(callback func(hWnd HWND, lparam uintptr) bool, lparam uintptr) error {
	cb := func(hWnd syscall.Handle, lparam uintptr) int {
		if callback(HWND(hWnd), lparam) {
			return 1
		} else {
			return 0
		}
	}

	ret, _, err := syscall.Syscall(procEnumWindows.Addr(), 2, syscall.NewCallback(cb), uintptr(lparam), 0)
	if ret != 0 {
		if err != 0 {
			return fmt.Errorf("WINAPI [EnumWindows] Error %+v", err)
		}
	}

	return nil
}

func GetWindow(hWnd HWND, uCmd uint) HWND {
	ret, _, _ := procGetWindow.Call(uintptr(hWnd), uintptr(uCmd))
	return HWND(ret)
}

func GetWindowThreadProcessId(hWnd HWND) (processId uint32) {
	_, _, _ = procGetWindowThreadProcessId.Call(
		uintptr(hWnd),
		uintptr(unsafe.Pointer(&processId)),
	)
	return processId
}

func GetWindowText(hWnd HWND) string {
	textLen := GetWindowTextLength(hWnd) + 1

	buf := make([]uint16, textLen)
	procGetWindowText.Call(
		uintptr(hWnd),
		uintptr(unsafe.Pointer(&buf[0])),
		uintptr(textLen),
	)

	return syscall.UTF16ToString(buf)
}

func GetWindowTextLength(hWnd HWND) int {
	ret, _, _ := procGetWindowTextLength.Call(uintptr(hWnd))
	return int(ret)
}

func IsWindowMain(hWnd HWND) bool {
	ret, _, _ := procGetWindow.Call(uintptr(hWnd), uintptr(GW_OWNER))
	return ret == uintptr(0)
}

func IsWindowVisible(hWnd HWND) bool {
	ret, _, _ := procIsWindowVisible.Call(uintptr(hWnd))
	return ret != 0
}

func SendMessage(hWnd HWND, msg uint32, wParam uintptr, lParam uintptr) uintptr {
	ret, _, _ := procSendMessage.Call(uintptr(hWnd), uintptr(msg), wParam, lParam)
	return ret
}

func WindowCloseMessage(hWnd HWND) uintptr {
	return SendMessage(hWnd, WM_SYSCOMMAND, SC_CLOSE, 0)
}

func WindowSendKey(hWnd HWND, key uint16) {
	 SendMessage(hWnd, WM_KEYDOWN, uintptr(key), 0)
	 time.Sleep(100 * time.Millisecond)
	 SendMessage(hWnd, WM_KEYUP, uintptr(key), 0)
}

func GetWindowRect(hwnd HWND) *RECT {
	var rect RECT
	procGetWindowRect.Call(
		uintptr(hwnd),
		uintptr(unsafe.Pointer(&rect)))

	return &rect
}

func MouseClick(x int32, y int32) {
	procSetCursorPos.Call(uintptr(x), uintptr(y))
	procMouse.Call(uintptr(MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_LEFTUP), 0, 0, 0, 0)
}
