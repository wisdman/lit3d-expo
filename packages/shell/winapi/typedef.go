//go:build windows

package winapi

import "syscall"

type (
	HWND uintptr
)

const (
	MAX_PATH           = 260
	TH32CS_SNAPPROCESS = 0x00000002

	GW_OWNER = 4

	WM_SYSCOMMAND = 0x0112

	SC_CLOSE = 0xF060

	INPUT_KEYBOARD = 1
	KEYEVENTF_KEYUP = 0x0002
)

type PROCESSENTRY32 struct {
	Size              uint32
	CntUsage          uint32
	ProcessID         uint32
	DefaultHeapID     uintptr
	ModuleID          uint32
	CntThreads        uint32
	ParentProcessID   uint32
	PriorityClassBase int32
	Flags             uint32
	szExeFile         [MAX_PATH]uint16
}

func (p *PROCESSENTRY32) ExeFile() string {
	return syscall.UTF16ToString(p.szExeFile[:MAX_PATH])
}
