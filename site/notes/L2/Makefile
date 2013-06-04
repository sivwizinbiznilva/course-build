APP=L2
ARCH=msp430g2553

CC=msp430-gcc
CFLAGS=-Wall -Os -mmcu=$(ARCH)
LDFLAGS=-nostdlib -nostartfiles

all: $(APP).elf

$(APP).elf: $(APP).o
	$(CC) $(CFLAGS) $(APP).o $(LDFLAGS) -o $(APP).elf
