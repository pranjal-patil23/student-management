import tkinter as tk
from tkinter import messagebox

# ----- CPU Components -----
memory = [0] * 256
registers = {"R1": 0, "R2": 0, "R3": 0, "R4": 0}
pc = 0
program = []

# ----- Instruction Execution -----
def execute_instruction(instr):
    global pc
    parts = instr.replace(",", "").split()
    if not parts:
        return
    op = parts[0].upper()

    if op == "LOAD":
        reg, value = parts[1], int(parts[2])
        registers[reg] = value
    
    elif op == "STORE":
        reg, addr = parts[1], int(parts[2])
        memory[addr] = registers[reg]

    elif op == "ADD":
        dest, r1, r2 = parts[1], parts[2], parts[3]
        registers[dest] = registers[r1] + registers[r2]

    elif op == "SUB":
        dest, r1, r2 = parts[1], parts[2], parts[3]
        registers[dest] = registers[r1] - registers[r2]

    elif op == "MUL":
        dest, r1, r2 = parts[1], parts[2], parts[3]
        registers[dest] = registers[r1] * registers[r2]

    elif op == "DIV":
        dest, r1, r2 = parts[1], parts[2], parts[3]
        registers[dest] = registers[r1] // registers[r2]

    elif op == "JMP":
        addr = int(parts[1])
        pc = addr - 1

    elif op == "HALT":
        messagebox.showinfo("Program Halted", "Program has been executed successfully.")
        update_display()
        return "HALT"

# ----- GUI Functions -----
def load_program():
    global program, pc
    pc = 0
    code = text_input.get("1.0", tk.END).strip()
    program = [line for line in code.split("\n") if line.strip()]
    update_display()
    messagebox.showinfo("Loaded", "Program loaded successfully!")

def step_execution():
    global pc
    if pc >= len(program):
        messagebox.showinfo("End", "No more instructions to execute.")
        return
    instr = program[pc]
    result = execute_instruction(instr)
    pc += 1
    update_display()
    if result == "HALT":
        pc = len(program)

def run_program():
    global pc
    while pc < len(program):
        instr = program[pc]
        result = execute_instruction(instr)
        pc += 1
        if result == "HALT":
            break
    update_display()

def reset_simulator():
    global memory, registers, pc, program
    memory = [0] * 256
    registers = {"R1": 0, "R2": 0, "R3": 0, "R4": 0}
    pc = 0
    program = []
    text_input.delete("1.0", tk.END)
    update_display()

def update_display():
    reg_text = "\n".join([f"{r}: {v}" for r, v in registers.items()])
    reg_label.config(text=reg_text)
    mem_text = "\n".join([f"MEM[{i}] = {v}" for i, v in enumerate(memory[100:106], start=100)])
    mem_label.config(text=mem_text)
    pc_label.config(text=f"Program Counter: {pc}")

# ----- GUI Layout -----
root = tk.Tk()
root.title("Instruction Execution Simulator")
root.geometry("800x500")
root.config(bg="#1e1e1e")

# Title
tk.Label(root, text="🧠 Instruction Execution Simulator", font=("Arial", 18, "bold"), fg="#00ff99", bg="#1e1e1e").pack(pady=10)

# Text area
frame_top = tk.Frame(root, bg="#1e1e1e")
frame_top.pack(pady=10)
text_input = tk.Text(frame_top, height=10, width=80, font=("Consolas", 12))
text_input.pack()

# Buttons
frame_buttons = tk.Frame(root, bg="#1e1e1e")
frame_buttons.pack(pady=10)

tk.Button(frame_buttons, text="Load Program", command=load_program, width=15, bg="#007acc", fg="white").grid(row=0, column=0, padx=5)
tk.Button(frame_buttons, text="Step", command=step_execution, width=10, bg="#ffaa00", fg="black").grid(row=0, column=1, padx=5)
tk.Button(frame_buttons, text="Run", command=run_program, width=10, bg="#00cc66", fg="white").grid(row=0, column=2, padx=5)
tk.Button(frame_buttons, text="Reset", command=reset_simulator, width=10, bg="#ff5555", fg="white").grid(row=0, column=3, padx=5)

# Status Display
frame_status = tk.Frame(root, bg="#1e1e1e")
frame_status.pack(pady=15)

pc_label = tk.Label(frame_status, text="Program Counter: 0", fg="white", bg="#1e1e1e", font=("Arial", 12))
pc_label.grid(row=0, column=0, columnspan=2, pady=5)

reg_label = tk.Label(frame_status, text="", fg="#00ffff", bg="#1e1e1e", justify="left", font=("Consolas", 12))
reg_label.grid(row=1, column=0, padx=20)

mem_label = tk.Label(frame_status, text="", fg="#ff99ff", bg="#1e1e1e", justify="left", font=("Consolas", 12))
mem_label.grid(row=1, column=1, padx=20)

update_display()
root.mainloop()