import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // `rehype-katex` does not import the CSS for you
import './Learning.css';

// Initial dummy data for the course, loaded into local storage
const initialTopics = [
  {
    id: 'topic-1',
    order_number: 1,
    title: '1. Introduction to Quantum Computing',
    content: `# 1. Introduction to Quantum Computing\n\nWelcome to the fascinating world of quantum computing! This discipline sits at the intersection of physics, computer science, and mathematics.\n\n## What is Quantum Computing?\n\nUnlike classical computing, which relies on bits (0s and 1s) to process information, quantum computing uses **qubits**. Qubits leverage the principles of quantum mechanics, such as superposition and entanglement, to perform complex calculations at speeds that would be impossible for even the most powerful classical supercomputers.\n\n## Why Does it Matter?\n\nCertain problems are computationally intractable for classical computers. These include:\n\n- **Factoring large numbers**: Crucial for breaking modern cryptography (e.g., Shor's algorithm).\n- **Simulating molecular structures**: Essential for discovering new drugs and materials.\n- **Optimization problems**: Finding the most efficient routes or resource allocations in logistics.\n\n## The Quantum Advantage\n\nThe phrase *quantum advantage* refers to the moment a quantum computer can perform a specific task faster or more efficiently than the best possible classical computer. We are currently in the **NISQ (Noisy Intermediate-Scale Quantum)** era, where our quantum processors have dozens to hundreds of qubits, but are still prone to errors (noise).\n\nIn the next modules, we will dive into the core concepts that make quantum computation so incredibly powerful.`
  },
  {
    id: 'topic-2',
    order_number: 2,
    title: '2. Linear Algebra Foundations',
    content: `# 2. Linear Algebra Foundations\n\nTo truly understand quantum mechanics and quantum computing, we must first speak its language: **Linear Algebra**.\n\n## Vectors in Hilbert Space\n\nA quantum state is represented mathematically as a vector in a complex vector space known as a **Hilbert space**. In the context of quantum computing, we often deal with finite-dimensional Hilbert spaces.\n\nWe use **Dirac notation** (or bra-ket notation) to write vectors:\n- A column vector is called a "ket" and is written as $|\\psi\\rangle$.\n- A row vector (the conjugate transpose of a ket) is called a "bra" and is written as $\\langle\\psi|$.\n\n## Matrices and Operators\n\nQuantum operations (or gates) are represented by **matrices**. When an operation is applied to a quantum state, it is mathematically equivalent to multiplying the state vector by a matrix.\n\nFor an operation to be valid in quantum mechanics, the matrix must be **unitary**. A unitary matrix $U$ satisfies the condition:\n\n$$ U^\\dagger U = I $$\n\nWhere $U^\\dagger$ is the conjugate transpose of $U$, and $I$ is the identity matrix. Unitary operations ensure that the total probability of all possible outcomes always sums up to 1.\n\n## Inner Products\n\nThe inner product of two vectors $|\\psi\\rangle$ and $|\\phi\\rangle$ is written as $\\langle\\phi|\\psi\\rangle$. It gives a complex number that represents the geometric "overlap" between the two states, which is crucial for calculating measurement probabilities.`
  },
  {
    id: 'topic-3',
    order_number: 3,
    title: '3. Qubits & Superposition',
    content: `# 3. Qubits & Superposition\n\n## The Qubit\n\nThe fundamental unit of classical information is the bit, which is always deterministic: it is either $0$ or $1$. \n\nThe quantum analogue is the **qubit** (quantum bit). While a qubit can also be measured as a $0$ or $1$, it can exist in a linear combination of both states simultaneously before it is measured. This is known as **superposition**.\n\n## Mathematical Representation\n\nThe two basic states of a single qubit are represented by the standard basis vectors:\n\n$|0\\rangle$ = $\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $|1\\rangle$ = $\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$\n\nA general qubit state $|\\psi\\rangle$ is written as:\n\n$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$\n\nWhere $\\alpha$ and $\\beta$ are **probability amplitudes** (complex numbers). \n\n## The Born Rule\n\nThe probability of measuring the qubit in the state $|0\\rangle$ is given by $|\\alpha|^2$, and the probability of measuring $|1\\rangle$ is $|\\beta|^2$. \n\nBecause the qubit must be found in *some* state when measured, the probabilities must sum to 1:\n\n$|\\alpha|^2 + |\\beta|^2 = 1$\n\nThis normalization condition restricts the valid states of a qubit, allowing us to visualize the state space of a single qubit geometrically as the surface of a sphere, known as the **Bloch Sphere**.`
  },
  {
    id: 'topic-4',
    order_number: 4,
    title: '4. Quantum Gates',
    content: `# 4. Quantum Gates\n\nJust as classical circuits are built using logic gates (AND, OR, NOT), quantum circuits are built using **quantum gates**. Quantum gates are unitary matrices that operate on qubits.\n\n## The Pauli Gates\n\nThe Pauli matrices are three of the most fundamental single-qubit gates:\n\n1. **Pauli-X (NOT gate)**: Flips $|0\\rangle$ to $|1\\rangle$ and vice-versa. It acts as a rotation of $\\pi$ around the X-axis of the Bloch sphere.\n2. **Pauli-Y**: Applies a bit and phase flip. Rotation of $\\pi$ around the Y-axis.\n3. **Pauli-Z (Phase flip)**: Leaves $|0\\rangle$ unchanged but flips the sign of $|1\\rangle$ to $-|1\\rangle$. Rotation of $\\pi$ around the Z-axis.\n\n## The Hadamard Gate (H)\n\nThe Hadamard gate is arguably the most important single-qubit gate. It creates an equal superposition. If you apply $H$ to a $|0\\rangle$ state, you get:\n\n$H|0\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) = |+\\rangle$\n\nIf you measure this state, you have a perfectly random 50% chance of getting 0 and a 50% chance of getting 1.\n\n## Multi-Qubit Gates\n\nTo perform useful computations, qubits must interact. The **CNOT (Controlled-NOT)** gate is the standard two-qubit gate. It has a "control" qubit and a "target" qubit.\n\n- If the control qubit is $|0\\rangle$, the target qubit is left alone.\n- If the control qubit is $|1\\rangle$, the Pauli-X gate is applied to the target qubit, flipping its state.\n\nThe CNOT gate is essential for creating quantum entanglement.`
  },
  {
    id: 'topic-5',
    order_number: 5,
    title: '5. Entanglement',
    content: `# 5. Entanglement\n\n**Quantum entanglement** is arguably the most counterintuitive and powerful feature of quantum mechanics. Albert Einstein famously referred to it as "spooky action at a distance."\n\n## What is Entanglement?\n\nWhen two or more qubits become entangled, their quantum states merge such that the state of one qubit cannot be described independently of the state of the other(s). \n\nFor example, consider the **Bell State** $\\Phi^+$:\n\n$|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$\n\nIn this state, neither the first nor the second qubit has a definite state. If you measure the first qubit, you have a 50% chance of getting 0 and a 50% chance of getting 1. \n\nHowever, the moment you measure the first qubit and get a 0, the entire state collapses to $|00\\rangle$. This means if you immediately measure the second qubit, you are **100% guaranteed** to also get a 0. The measurements are perfectly correlated, no matter how far apart the two qubits are in the universe.\n\n## Why is it Useful?\n\nEntanglement is the core resource that enables quantum cryptography, quantum teleportation, and quantum error correction. It fundamentally increases the connectivity and information density of a quantum system compared to a classical one.`
  },
  {
    id: 'topic-6',
    order_number: 6,
    title: '6. Measurement & Observables',
    content: `# 6. Measurement & Observables\n\nIn classical physics, observing a system (like reading a bit from a hard drive) does not alter the system. In quantum mechanics, **measurement inherently changes the state of the system**.\n\n## Wavefunction Collapse\n\nWhen a qubit in superposition is measured, it irreversibly "collapses" into one of the definite basis states (usually $|0\\rangle$ or $|1\\rangle$). All the rich information contained in the probability amplitudes ($\\alpha$ and $\\beta$) is lost.\n\nThis means that you cannot read the exact state of a single unknown qubit! You can only extract a single classical bit of information from it per measurement.\n\n## Observables\n\nAn **observable** is a physical property of a system that can be measured, such as energy, position, or spin. Mathematically, observables are represented by Hermitian matrices. The possible outcomes of a measurement are the *eigenvalues* of the observable's matrix, and after the measurement, the system's state collapses into the corresponding *eigenvector*.\n\n## The No-Cloning Theorem\n\nBecause measurement destroys quantum states, and because quantum operators must be unitary and linear, it is fundamentally impossible to create an identical copy of an arbitrary unknown quantum state. This profound result is called the **No-Cloning Theorem**. It forms the basis of quantum cryptography; if an eavesdropper tries to intercept and copy a quantum key, they will inevitably alter the state and reveal their presence.`
  },
  {
    id: 'topic-7',
    order_number: 7,
    title: '7. Quantum Teleportation',
    content: `# 7. Quantum Teleportation\n\nBecause of the No-Cloning Theorem, we cannot simply copy a quantum state to send it across a network. Instead, we use a protocol called **Quantum Teleportation**.\n\n## The Goal\n\nAlice wants to send an unknown quantum state $|\\psi\\rangle$ to Bob. \n\n## The Protocol\n\n1. **Preparation**: Alice and Bob must first share a pair of entangled qubits (a Bell pair). Alice takes one half, and Bob takes the other.\n2. **Interaction**: Alice performs a joint measurement (a Bell-basis measurement) on the unknown state $|\\psi\\rangle$ and her half of the entangled pair.\n3. **Classical Communication**: Alice's measurement yields two classical bits of information (00, 01, 10, or 11). She sends these two classical bits to Bob over a standard classical channel (like the internet or a phone call).\n4. **Correction**: Based on the two classical bits he receives, Bob applies a specific set of quantum gates (Pauli-X and/or Pauli-Z) to his half of the entangled pair.\n\n## The Result\n\nAfter Bob applies his gates, his qubit transforms perfectly into the original state $|\\psi\\rangle$. The state was "teleported" from Alice to Bob!\n\nNote that the original state at Alice's location was completely destroyed during her measurement. Furthermore, teleportation does *not* allow faster-than-light communication, because Bob must wait to receive Alice's classical bits before he can recover the state.`
  },
  {
    id: 'topic-8',
    order_number: 8,
    title: '8. Quantum Algorithms',
    content: `# 8. Quantum Algorithms\n\nWhat can we actually do with all these qubits and gates? The power of quantum computers lies in specialized algorithms that exploit superposition, entanglement, and interference.\n\n## Quantum Interference\n\nLike ripples in a pond, probability amplitudes can be positive or negative (or complex). When amplitudes are combined, they can add up (constructive interference) or cancel each other out (destructive interference). \n\nThe goal of almost every quantum algorithm is to choreograph a sequence of gates such that the paths leading to the *wrong* answers destructively interfere (cancel out) and the paths leading to the *right* answer constructively interfere (amplify). \n\n## Famous Algorithms\n\n- **Deutsch-Jozsa Algorithm**: One of the first algorithms to demonstrate an exponential speedup over classical algorithms for a specific, albeit contrived, problem.\n- **Grover's Algorithm**: Provides a quadratic speedup for searching an unsorted database. If a classical computer takes $N$ steps to find an item, Grover's takes roughly $\\sqrt{N}$ steps.\n- **Shor's Algorithm**: Finds the prime factors of a large integer in polynomial time. This algorithm is famous because it poses a theoretical threat to RSA encryption, the cryptographic protocol that secures much of the modern internet.\n\nAs we continue to improve quantum hardware and mitigate errors, these theoretical algorithms will become practical tools for solving humanity's most complex problems.`
  },

  {
    id: 'topic-9',
    order_number: 9,
    title: '9. Quantum Circuit Design',
    content: `# 9. Quantum Circuit Design\n\nDesigning a quantum circuit is akin to composing a piece of music, where each qubit is an instrument and the gates are the notes played over time. The goal is to choreograph these operations to perform a specific calculation.\n\n## Core Principles\n\n1. **Initialization**: Circuits almost always begin with all qubits in the $|0\\rangle$ state.\n2. **Superposition Generation**: We typically apply Hadamard ($H$) gates to create a massive superposition of all possible inputs.\n3. **Oracle Application (The "Black Box")**: Many algorithms use an "oracle" matrix that marks the correct answer by flipping its phase (multiplying its amplitude by $-1$).\n4. **Interference / Amplification**: We apply more gates (like the diffusion operator in Grover's algorithm) to amplify the amplitude of the correct state and diminish the others.\n5. **Measurement**: Finally, we measure the qubits. Due to the amplification step, the probability of measuring the correct answer is highly maximized.\n\n## Reversibility\n\nA key quirk of quantum circuit design is **reversibility**. Because all quantum gates (except measurement) are unitary matrices, they are completely reversible. This means you can't have a standard classical "AND" gate, because knowing the output is 0 doesn't tell you if the input was 00, 01, or 10. \n\nInstead, we use gates like the **Toffoli gate** (CCNOT), which acts as a reversible AND gate by using a third target qubit.`
  },
  {
    id: 'topic-10',
    order_number: 10,
    title: '10. Programming with Qiskit',
    content: `# 10. Programming with Qiskit\n\nYou don't need a physical quantum computer in your bedroom to start programming! You can use frameworks like **Qiskit** (developed by IBM) to build quantum circuits in Python and simulate them on your laptop, or send them over the cloud to run on real quantum hardware.\n\n## A Simple Qiskit Example\n\nLet's create a Bell State (an entangled pair) using Qiskit.\n\n\`\`\`python\nfrom qiskit import QuantumCircuit, transpile\nfrom qiskit_aer import AerSimulator\n\n# Create a circuit with 2 qubits and 2 classical bits\nqc = QuantumCircuit(2, 2)\n\n# Apply a Hadamard gate to qubit 0\nqc.h(0)\n\n# Apply a CNOT gate: control=qubit 0, target=qubit 1\nqc.cx(0, 1)\n\n# Measure both qubits\nqc.measure([0, 1], [0, 1])\n\n# Draw the circuit\nprint(qc.draw())\n\`\`\`\n\n## Running the Circuit\n\nOnce the circuit is designed, you can use a simulator (like \`AerSimulator\`) to run it thousands of times ("shots") to get a statistical distribution of the results, which should be roughly 50% \`00\` and 50% \`11\`.\n\nQuantum programming bridges the gap between abstract theoretical physics and practical software engineering, paving the way for the quantum developers of tomorrow.`
  }
];

const Learning = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topicContent, setTopicContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch topics from local storage on mount
  useEffect(() => {
    const fetchTopics = () => {
      try {
        // Check if topics exist in local storage
        let storedTopics = localStorage.getItem('quantum_learning_topics_v3');
        if (!storedTopics) {
          storedTopics = JSON.stringify(initialTopics);
          localStorage.setItem('quantum_learning_topics_v3', storedTopics);
        }

        const parsedTopics = JSON.parse(storedTopics);
        // Sort by order_number ascending
        const sorted = parsedTopics.sort((a, b) => a.order_number - b.order_number);
        setTopics(sorted);

        if (sorted.length > 0) {
          setSelectedTopicId(sorted[0].id);
        }
      } catch (err) {
        console.error("Failed to load topics from local storage:", err);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to simulate loading for UX
    setTimeout(fetchTopics, 300);
  }, []);

  // Fetch full content when a topic is selected
  useEffect(() => {
    if (!selectedTopicId || topics.length === 0) return;

    const selectedTopic = topics.find(t => t.id === selectedTopicId);
    if (selectedTopic) {
      setTopicContent(selectedTopic);
      // Optional: scroll to top of content when topic changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedTopicId, topics]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <h2 className="page-title">Loading Modules...</h2>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="game-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>No Topics Available Yet!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container learning-layout game-card" style={{ padding: 0, overflow: 'hidden' }}>

      {/* LEFT SIDEBAR: Topic List */}
      <aside className={`sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          {isSidebarOpen && <h3 style={{ margin: 0, color: 'var(--color-primary)', fontWeight: '900', textTransform: 'uppercase' }}>Modules</h3>}
          <button
            className="toggle-sidebar-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>

        <ul className="topic-list" style={{ display: isSidebarOpen ? 'flex' : 'none' }}>
          {topics.map(topic => (
            <li key={topic.id}>
              <button
                className={`topic-btn ${selectedTopicId === topic.id ? 'active' : ''}`}
                onClick={() => setSelectedTopicId(topic.id)}
              >
                <span className="topic-number">{topic.order_number}</span>
                <span className="topic-title">{topic.title}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Minimized view icons */}
        {!isSidebarOpen && (
          <ul className="topic-list-collapsed">
            {topics.map(topic => (
              <li key={topic.id}>
                <button
                  className={`topic-btn-mini ${selectedTopicId === topic.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setIsSidebarOpen(true);
                  }}
                  title={topic.title}
                >
                  <span className="topic-number">{topic.order_number}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* MAIN PANEL: Content */}
      <section className="content-panel">
        {topicContent ? (
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {topicContent.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div>Select a topic to start learning.</div>
        )}
      </section>

    </div>
  );
};

export default Learning;
