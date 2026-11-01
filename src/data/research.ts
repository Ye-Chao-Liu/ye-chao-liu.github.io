// Editorial narratives. Publication and project relationships are derived from their highlightIds.
export const highlights = [
  {
    "id": "verification",
    "title": "Scalable Quantum Property Learning",
    "summary": "Exploring new measurement strategies and quantum operations to efficiently learn properties of large-scale quantum systems.",
    "paragraphs": [
      "Learning about large-scale quantum systems requires careful choices about which measurements to perform and how to use limited resources. New measurement strategies and quantum operations offer ways to improve the efficiency of information acquisition.",
      "Representative results concern efficient verification of Dicke states, universally optimal verification with nondemolition measurements, and collective verification strategies. These established results address specific verification tasks and motivate broader questions about quantum property learning.",
      "The longer-term perspective extends beyond conventional state verification toward learning quantum properties with resource-aware measurements and operations."
    ],
    "order": 1
  },
  {
    "id": "imperfect",
    "title": "Reliable Quantum Data Inference",
    "summary": "Understanding how noise, incomplete information, and underlying assumptions affect the reliability of quantum inference.",
    "paragraphs": [
      "The reliability of quantum inference depends on more than measurement noise. It also depends on incomplete information and the explicit or implicit assumptions built into theoretical and statistical models.",
      "Interpreting and reanalyzing existing measurement data can reveal which conclusions follow from the available information and which change when assumptions are relaxed or violated. The published work on verification under noisy measurements provides one concrete example within this broader perspective.",
      "Ongoing interests concern reliable inference under imperfect or incomplete information, including the role of model assumptions in the interpretation of quantum data."
    ],
    "order": 2
  },
  {
    "id": "preparation",
    "title": "Measurement-Informed Quantum Implementation",
    "summary": "Using measurement information to guide and improve quantum implementation.",
    "paragraphs": [
      "Quantum measurements can serve purposes beyond characterization, estimation, or verification. The information they provide can also guide quantum implementation and help improve information-processing tasks.",
      "The experimental work on prescriptive preparation and verification of nonstabilizer states provides a concrete example: information from quantum verification measurements was used to guide state preparation without requiring full state tomography as part of the preparation-optimization procedure.",
      "This demonstrated use of measurement information motivates a broader interest in measurement-informed operations. Future research will explore how this principle extends to other quantum operations and information-processing tasks."
    ],
    "order": 3
  },
  {
    "id": "computation",
    "title": "Quantum Resource Detection and Quantification",
    "summary": "Developing efficient methods to detect and quantify quantum resources with rigorous guarantees.",
    "paragraphs": [
      "Quantum resource characterization connects mathematical models, numerical optimization, and the information available about a quantum system. Efficient algorithms and reliable bounds are central to detecting and quantifying these resources.",
      "Representative work includes an algorithm for evaluating distance-based entanglement measures and a unified toolbox for multipartite entanglement certification, accepted by Physical Review A in 2026. These results concern entanglement.",
      "Longer-term interests also include quantum coherence and quantum nonlocality, quantitative resource measures, and rigorous bounds."
    ],
    "order": 4
  }
];
