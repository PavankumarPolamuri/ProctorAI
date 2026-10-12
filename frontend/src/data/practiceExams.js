// ═══════════════════════════════════════════════════════════════════
// PROCTOR AI — Public Practice Exam Data (Frontend-Only)
// ═══════════════════════════════════════════════════════════════════
// These sample exams are COMPLETELY ISOLATED from real exams.
// They never touch the backend, database, or any authenticated API.
// All scoring is calculated locally in the browser.
// ═══════════════════════════════════════════════════════════════════

export const practiceExams = [
  {
    id: 'practice-java-basics',
    title: 'Java Programming Basics',
    subject: 'Java',
    description: 'Test your knowledge of core Java concepts including data types, OOP principles, exception handling, and basic syntax.',
    durationMinutes: 15,
    totalMarks: 10,
    marksPerQuestion: 1,
    negativeMarks: 0,
    icon: '☕',
    difficulty: 'Beginner',
    questions: [
      {
        id: 'java-q1',
        questionText: 'Which of the following is NOT a primitive data type in Java?',
        options: {
          A: 'int',
          B: 'String',
          C: 'boolean',
          D: 'double'
        },
        correctAnswer: 'B',
        explanation: 'String is a reference type (class) in Java, not a primitive. The eight primitive types are: byte, short, int, long, float, double, boolean, and char.',
        marks: 1
      },
      {
        id: 'java-q2',
        questionText: 'What is the output of the following code?\n\nint x = 5;\nSystem.out.println(x++);',
        options: {
          A: '5',
          B: '6',
          C: 'Compilation error',
          D: 'Runtime error'
        },
        correctAnswer: 'A',
        explanation: 'The post-increment operator (x++) returns the current value of x (5) first and then increments it. So the output is 5.',
        marks: 1
      },
      {
        id: 'java-q3',
        questionText: 'Which keyword is used to prevent a class from being inherited in Java?',
        options: {
          A: 'static',
          B: 'abstract',
          C: 'final',
          D: 'private'
        },
        correctAnswer: 'C',
        explanation: 'The "final" keyword, when applied to a class, prevents it from being subclassed (inherited). For example: final class MyClass { }',
        marks: 1
      },
      {
        id: 'java-q4',
        questionText: 'What is the default value of a boolean instance variable in Java?',
        options: {
          A: 'true',
          B: 'false',
          C: 'null',
          D: '0'
        },
        correctAnswer: 'B',
        explanation: 'In Java, the default value of a boolean instance variable is false. Only local variables are not initialized by default.',
        marks: 1
      },
      {
        id: 'java-q5',
        questionText: 'Which of the following is used to handle exceptions in Java?',
        options: {
          A: 'try-catch',
          B: 'if-else',
          C: 'switch-case',
          D: 'for-each'
        },
        correctAnswer: 'A',
        explanation: 'The try-catch block is used to handle exceptions in Java. Code that might throw an exception is placed in the try block, and the catch block handles the exception.',
        marks: 1
      },
      {
        id: 'java-q6',
        questionText: 'What does the "super" keyword refer to in Java?',
        options: {
          A: 'The current class instance',
          B: 'The parent class',
          C: 'A static method',
          D: 'The main method'
        },
        correctAnswer: 'B',
        explanation: '"super" is used to refer to the immediate parent class. It can be used to call the parent constructor, access parent methods, or parent fields that are hidden by the child class.',
        marks: 1
      },
      {
        id: 'java-q7',
        questionText: 'Which collection class allows duplicate elements and maintains insertion order?',
        options: {
          A: 'HashSet',
          B: 'TreeSet',
          C: 'ArrayList',
          D: 'HashMap'
        },
        correctAnswer: 'C',
        explanation: 'ArrayList allows duplicate elements and maintains the insertion order. HashSet and TreeSet do not allow duplicates, and HashMap stores key-value pairs.',
        marks: 1
      },
      {
        id: 'java-q8',
        questionText: 'What is method overloading in Java?',
        options: {
          A: 'Defining a method in a subclass with the same signature as in the parent class',
          B: 'Defining multiple methods with the same name but different parameters in the same class',
          C: 'Calling a method recursively',
          D: 'Using the final keyword on a method'
        },
        correctAnswer: 'B',
        explanation: 'Method overloading occurs when multiple methods in the same class share the same name but differ in the number, type, or order of parameters. This is compile-time polymorphism.',
        marks: 1
      },
      {
        id: 'java-q9',
        questionText: 'Which access modifier makes a member accessible only within the same class?',
        options: {
          A: 'public',
          B: 'protected',
          C: 'default',
          D: 'private'
        },
        correctAnswer: 'D',
        explanation: 'The "private" access modifier restricts access to only within the same class. It is the most restrictive access level in Java.',
        marks: 1
      },
      {
        id: 'java-q10',
        questionText: 'What is the entry point of any Java application?',
        options: {
          A: 'public static void main(String[] args)',
          B: 'public void start()',
          C: 'static void run()',
          D: 'public main(String args)'
        },
        correctAnswer: 'A',
        explanation: 'The main method with the signature "public static void main(String[] args)" is the entry point for any Java application. The JVM looks for this exact method signature when starting the program.',
        marks: 1
      }
    ]
  },
  {
    id: 'practice-dsa',
    title: 'Data Structures & Algorithms',
    subject: 'DSA',
    description: 'Evaluate your understanding of fundamental data structures, sorting algorithms, time complexity, and problem-solving patterns.',
    durationMinutes: 15,
    totalMarks: 10,
    marksPerQuestion: 1,
    negativeMarks: 0,
    icon: '🧮',
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'dsa-q1',
        questionText: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
        options: {
          A: 'O(1)',
          B: 'O(log n)',
          C: 'O(n)',
          D: 'O(n log n)'
        },
        correctAnswer: 'B',
        explanation: 'In a balanced BST, each comparison eliminates half of the remaining nodes, resulting in O(log n) time complexity for search operations.',
        marks: 1
      },
      {
        id: 'dsa-q2',
        questionText: 'Which data structure uses LIFO (Last In, First Out) ordering?',
        options: {
          A: 'Queue',
          B: 'Stack',
          C: 'Linked List',
          D: 'Array'
        },
        correctAnswer: 'B',
        explanation: 'A Stack follows LIFO order — the last element pushed onto the stack is the first one to be popped off. Common uses include function call management, undo operations, and expression evaluation.',
        marks: 1
      },
      {
        id: 'dsa-q3',
        questionText: 'What is the worst-case time complexity of QuickSort?',
        options: {
          A: 'O(n)',
          B: 'O(n log n)',
          C: 'O(n²)',
          D: 'O(log n)'
        },
        correctAnswer: 'C',
        explanation: 'QuickSort has a worst-case complexity of O(n²), which occurs when the pivot is always the smallest or largest element (e.g., already sorted data with a poor pivot choice). Its average case is O(n log n).',
        marks: 1
      },
      {
        id: 'dsa-q4',
        questionText: 'Which data structure is best suited for implementing a priority queue?',
        options: {
          A: 'Array',
          B: 'Linked List',
          C: 'Heap',
          D: 'Stack'
        },
        correctAnswer: 'C',
        explanation: 'A Heap (typically a binary min-heap or max-heap) provides O(log n) insertion and O(log n) removal of the highest-priority element, making it ideal for priority queues.',
        marks: 1
      },
      {
        id: 'dsa-q5',
        questionText: 'What is the space complexity of a recursive Fibonacci function without memoization?',
        options: {
          A: 'O(1)',
          B: 'O(n)',
          C: 'O(n²)',
          D: 'O(2^n)'
        },
        correctAnswer: 'B',
        explanation: 'The space complexity is O(n) due to the recursion stack. At any point, the maximum depth of the call stack is n. The time complexity, however, is O(2^n) without memoization.',
        marks: 1
      },
      {
        id: 'dsa-q6',
        questionText: 'In a singly linked list, what is the time complexity of inserting a node at the beginning?',
        options: {
          A: 'O(1)',
          B: 'O(n)',
          C: 'O(log n)',
          D: 'O(n²)'
        },
        correctAnswer: 'A',
        explanation: 'Inserting at the beginning of a singly linked list is O(1) because you only need to create a new node, point it to the current head, and update the head pointer.',
        marks: 1
      },
      {
        id: 'dsa-q7',
        questionText: 'Which traversal of a Binary Search Tree gives elements in sorted order?',
        options: {
          A: 'Pre-order',
          B: 'Post-order',
          C: 'In-order',
          D: 'Level-order'
        },
        correctAnswer: 'C',
        explanation: 'In-order traversal (Left → Root → Right) of a BST visits nodes in ascending sorted order. This property makes BSTs useful for maintaining sorted data.',
        marks: 1
      },
      {
        id: 'dsa-q8',
        questionText: 'What is a hash collision?',
        options: {
          A: 'When a hash table is full',
          B: 'When two different keys produce the same hash value',
          C: 'When a hash function produces negative values',
          D: 'When the hash table is resized'
        },
        correctAnswer: 'B',
        explanation: 'A hash collision occurs when two different keys are mapped to the same index by the hash function. Common resolution techniques include chaining (linked lists at each index) and open addressing.',
        marks: 1
      },
      {
        id: 'dsa-q9',
        questionText: 'Which algorithm is used to find the shortest path in an unweighted graph?',
        options: {
          A: 'Depth-First Search (DFS)',
          B: 'Breadth-First Search (BFS)',
          C: 'Binary Search',
          D: 'Merge Sort'
        },
        correctAnswer: 'B',
        explanation: 'BFS explores nodes level by level, guaranteeing the shortest path in an unweighted graph. DFS does not guarantee the shortest path.',
        marks: 1
      },
      {
        id: 'dsa-q10',
        questionText: 'What is the amortized time complexity of inserting an element into a dynamic array (e.g., ArrayList)?',
        options: {
          A: 'O(1)',
          B: 'O(n)',
          C: 'O(log n)',
          D: 'O(n log n)'
        },
        correctAnswer: 'A',
        explanation: 'While occasional resizing takes O(n), the amortized cost of insertion is O(1) because resizing doubles the capacity, so the costly operation occurs infrequently.',
        marks: 1
      }
    ]
  },
  {
    id: 'practice-cs-general',
    title: 'General Computer Science',
    subject: 'Computer Science',
    description: 'A broad assessment covering operating systems, networking, databases, software engineering principles, and computing fundamentals.',
    durationMinutes: 15,
    totalMarks: 10,
    marksPerQuestion: 1,
    negativeMarks: 0,
    icon: '💻',
    difficulty: 'Beginner',
    questions: [
      {
        id: 'cs-q1',
        questionText: 'What does CPU stand for?',
        options: {
          A: 'Central Processing Unit',
          B: 'Computer Personal Unit',
          C: 'Central Program Utility',
          D: 'Control Processing Unit'
        },
        correctAnswer: 'A',
        explanation: 'CPU stands for Central Processing Unit. It is the primary component of a computer that performs most of the processing and acts as the "brain" of the computer.',
        marks: 1
      },
      {
        id: 'cs-q2',
        questionText: 'Which layer of the OSI model is responsible for routing packets across networks?',
        options: {
          A: 'Data Link Layer',
          B: 'Transport Layer',
          C: 'Network Layer',
          D: 'Session Layer'
        },
        correctAnswer: 'C',
        explanation: 'The Network Layer (Layer 3) is responsible for routing packets from source to destination across multiple networks. IP (Internet Protocol) operates at this layer.',
        marks: 1
      },
      {
        id: 'cs-q3',
        questionText: 'What does SQL stand for?',
        options: {
          A: 'Simple Query Language',
          B: 'Structured Query Language',
          C: 'Standard Query Logic',
          D: 'System Query Language'
        },
        correctAnswer: 'B',
        explanation: 'SQL stands for Structured Query Language. It is the standard language for managing and manipulating relational databases.',
        marks: 1
      },
      {
        id: 'cs-q4',
        questionText: 'Which of the following is a non-volatile memory?',
        options: {
          A: 'RAM',
          B: 'Cache',
          C: 'ROM',
          D: 'Register'
        },
        correctAnswer: 'C',
        explanation: 'ROM (Read-Only Memory) is non-volatile, meaning it retains its data even when the power is turned off. RAM, cache, and registers are volatile memory.',
        marks: 1
      },
      {
        id: 'cs-q5',
        questionText: 'What is the primary purpose of an operating system?',
        options: {
          A: 'To compile programs',
          B: 'To manage hardware resources and provide user services',
          C: 'To connect to the internet',
          D: 'To design user interfaces'
        },
        correctAnswer: 'B',
        explanation: 'An operating system manages hardware resources (CPU, memory, I/O devices) and provides services for application programs and users. Examples include Windows, Linux, and macOS.',
        marks: 1
      },
      {
        id: 'cs-q6',
        questionText: 'In object-oriented programming, what is encapsulation?',
        options: {
          A: 'The ability of a class to inherit from multiple classes',
          B: 'Bundling data and methods that operate on that data within a single unit',
          C: 'The process of creating objects from a class',
          D: 'Overriding methods in a subclass'
        },
        correctAnswer: 'B',
        explanation: 'Encapsulation is the principle of bundling data (attributes) and the methods (functions) that operate on that data into a single unit (class), and restricting direct access to some of the object\'s components.',
        marks: 1
      },
      {
        id: 'cs-q7',
        questionText: 'What protocol is used for secure web communication?',
        options: {
          A: 'HTTP',
          B: 'FTP',
          C: 'HTTPS',
          D: 'SMTP'
        },
        correctAnswer: 'C',
        explanation: 'HTTPS (HyperText Transfer Protocol Secure) uses TLS/SSL encryption to secure communication between the web browser and the server, protecting data from interception.',
        marks: 1
      },
      {
        id: 'cs-q8',
        questionText: 'What is a deadlock in operating systems?',
        options: {
          A: 'A process that runs infinitely',
          B: 'A situation where two or more processes are unable to proceed because each is waiting for the other',
          C: 'A memory leak in the system',
          D: 'A type of scheduling algorithm'
        },
        correctAnswer: 'B',
        explanation: 'A deadlock occurs when two or more processes are each waiting for resources held by the other, creating a circular dependency where none can proceed. The four necessary conditions are: mutual exclusion, hold and wait, no preemption, and circular wait.',
        marks: 1
      },
      {
        id: 'cs-q9',
        questionText: 'What is the binary representation of the decimal number 13?',
        options: {
          A: '1011',
          B: '1101',
          C: '1110',
          D: '1010'
        },
        correctAnswer: 'B',
        explanation: '13 in binary is 1101. This can be calculated as: 1×8 + 1×4 + 0×2 + 1×1 = 8 + 4 + 0 + 1 = 13.',
        marks: 1
      },
      {
        id: 'cs-q10',
        questionText: 'Which normal form eliminates transitive dependencies in database normalization?',
        options: {
          A: 'First Normal Form (1NF)',
          B: 'Second Normal Form (2NF)',
          C: 'Third Normal Form (3NF)',
          D: 'Boyce-Codd Normal Form (BCNF)'
        },
        correctAnswer: 'C',
        explanation: 'Third Normal Form (3NF) eliminates transitive dependencies — where a non-key attribute depends on another non-key attribute rather than directly on the primary key.',
        marks: 1
      }
    ]
  }
];
