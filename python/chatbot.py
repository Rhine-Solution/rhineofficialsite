# Rhine Chatbot - Python Fundamentals Demo
# This chatbot demonstrates: variables, operators, collections, loops, functions, choices


def main():
    print("=" * 50)
    print("  Welcome to Rhine Chatbot!")
    print("=" * 50)
    print()
    
    user_info = get_username()
    print(f"\nHello, {user_info}! I'm here to help you learn Python.")
    print("Type 'help' to see what I can do.")
    print()
    
    show_help()
    
    while True:
        command = input("\n> ").strip().lower()
        
        if command == "exit":
            print(f"Goodbye, {user_info}! Happy coding!")
            break
        elif command == "help":
            show_help()
        elif command == "menu":
            show_menu()
        elif command == "info":
            show_user_info(user_info)
        elif command == "1" or command == "learn":
            learn_python()
        elif command == "2" or command == "tips":
            get_tips()
        elif command == "3" or command == "game":
            play_game()
        elif command == "4" or command == "calculator":
            calculator()
        else:
            print("I don't understand. Type 'help' for available commands.")


def get_username():
    while True:
        name = input("What should I call you? ").strip()
        if name:
            return {"name": name, "language": "Python"}
        print("Please enter a valid name.")


def show_help():
    print("\n" + "=" * 40)
    print("Available Commands:")
    print("=" * 40)
    print("  help       - Show this help message")
    print("  menu       - Show the main menu")
    print("  info       - Show your information")
    print("  learn (1) - Learn Python basics")
    print("  tips (2)   - Get coding tips")
    print("  game (3)  - Play a guessing game")
    print("  calc (4)  - Use a calculator")
    print("  exit      - Quit the chatbot")
    print()


def show_user_info(info):
    print("\n" + "=" * 40)
    print("Your Information:")
    print("=" * 40)
    for key, value in info.items():
        print(f"  {key}: {value}")
    print()


def show_menu():
    print("\n" + "=" * 40)
    print("Main Menu:")
    print("=" * 40)
    print("  1. Learn Python Basics")
    print("  2. Get Coding Tips")
    print("  3. Play a Guessing Game")
    print("  4. Use Calculator")
    print()


def learn_python():
    topics = {
        "1": "Variables - Containers for storing data values",
        "2": "Data Types - int, float, str, bool, list, tuple, dict, set",
        "3": "Operators - Arithmetic (+, -, *, /), Comparison (==, !=, <, >), Logical (and, or, not)",
        "4": "Control Flow - if/elif/else, for/while loops, break/continue",
        "5": "Functions - def keyword to create reusable code blocks",
        "6": "Collections - Lists [], Tuples (), Dictionaries {}, Sets {}"
    }
    
    print("\nPython Fundamentals Topics:")
    for num, topic in topics.items():
        print(f"  {num}. {topic}")
    
    choice = input("\nSelect a topic (1-6): ").strip()
    if choice in topics:
        print(f"\n{topics[choice]}")
    else:
        print("\nInvalid selection.")


def get_tips():
    tips = [
        "Use meaningful variable names - makes code readable",
        "Comment your code - future you will thank you",
        "Practice daily - consistency is key to learning",
        "Start with the basics before frameworks",
        "Build projects - that's the best way to learn",
        "Don't fear errors - they are learning opportunities",
        "Use version control (Git) from day one",
        "Read documentation - it's your best friend"
    ]
    
    print("\nCoding Tips:")
    for i, tip in enumerate(tips, 1):
        print(f"  {i}. {tip}")
    
    print(f"\nTip #{len(tips)}: Have fun while learning!")


def play_game():
    import random
    
    print("\nGuessing Game!")
    print("I'm thinking of a number between 1 and 100.")
    
    number = random.randint(1, 100)
    attempts = 0
    max_attempts = 7
    
    while attempts < max_attempts:
        try:
            guess = int(input(f"\nAttempt {attempts + 1}/{max_attempts}. Your guess: "))
            attempts += 1
            
            if guess < number:
                print("Too low! Try again.")
            elif guess > number:
                print("Too high! Try again.")
            else:
                print(f"\nCongratulations! You got it in {attempts} attempts!")
                break
        except ValueError:
            print("Please enter a valid number.")
    
    if attempts >= max_attempts:
        print(f"\nGame over! The number was {number}.")


def calculator():
    print("\nSimple Calculator")
    print("Operations: +, -, *, /")
    
    try:
        num1 = float(input("Enter first number: "))
        op = input("Enter operation (+ - * /): ")
        num2 = float(input("Enter second number: "))
        
        if op == "+":
            result = num1 + num2
        elif op == "-":
            result = num1 - num2
        elif op == "*":
            result = num1 * num2
        elif op == "/":
            result = num1 / num2 if num2 != 0 else "Error: Division by zero"
        else:
            result = "Invalid operation"
        
        print(f"\nResult: {result}")
    except ValueError:
        print("\nError: Please enter valid numbers.")


if __name__ == "__main__":
    main()