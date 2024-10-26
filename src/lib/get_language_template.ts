import { ProgrammingLanguageOptions } from './types';

export function getLanguageTemplate(language: ProgrammingLanguageOptions): string {
  switch (language) {
    case 'typescript':
      return `// TypeScript Example
interface Greeting {
  message: string;
}

function greet(name: string): Greeting {
  return {
    message: \`Hello, \${name}!\`
  };
}

const result = greet('World');
console.log(result.message);`;

    case 'javascript':
      return `// JavaScript Example
function greet(name) {
  return {
    message: \`Hello, \${name}!\`
  };
}

const result = greet('World');
console.log(result.message);`;

    case 'python':
      return `# Python Example
def greet(name: str) -> dict:
    return {
        'message': f'Hello, {name}!'
    }

result = greet('World')
print(result['message'])`;

    case 'java':
      return `// Java Example
public class Greeting {
    public static void main(String[] args) {
        String message = greet("World");
        System.out.println(message);
    }

    public static String greet(String name) {
        return String.format("Hello, %s!", name);
    }
}`;

    case 'cpp':
      return `// C++ Example
#include <iostream>
#include <string>

std::string greet(const std::string& name) {
    return "Hello, " + name + "!";
}

int main() {
    std::string message = greet("World");
    std::cout << message << std::endl;
    return 0;
}`;

    case 'go':
      return `// Go Example
package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    message := greet("World")
    fmt.Println(message)
}`;

    case 'rust':
      return `// Rust Example
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    let message = greet("World");
    println!("{}", message);
}`;

    case 'ruby':
      return `# Ruby Example
def greet(name)
  "Hello, #{name}!"
end

message = greet("World")
puts message`;

    default:
      return '// Start coding here';
  }
}
