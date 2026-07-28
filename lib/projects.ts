export interface Project {
  title: string
  slug: string
  description: string
  technologies: string[]
  github?: string
  paper?: string
  demo?: string
  period?: string
  year: number
  highlights?: string[]
  accuracy?: string
  category: Array<"swe" | "ml">
  longDescription?: string[]
  codeSnippet?: {
    language: string
    filename: string
    code: string
  }
  images?: string[]
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export const projects: Project[] = [
  {
    title: "TAOL: Trust-Aware Orchestration Layer",
    slug: "taol",
    description:
      "Trust-aware middleware layer for LLM-powered coding agents that quantifies generation reliability using composite risk scoring and automated human-in-the-loop decision routing.",
    technologies: ["Python", "FastAPI", "Ollama", "AST", "Scikit-learn", "SQLite", "tree-sitter", "Rich"],
    github: "https://github.com/KartikDaGreat/trust-orchestrator",
    demo: "https://youtu.be/sOJtzGffaYA",
    period: "January - May 2026",
    year: 2026,
    category: ["ml", "swe"],
    accuracy: "99.2% ambiguity detection | AUC 0.999",
    longDescription: [
      "TAOL is a middleware layer that sits between a developer and their local LLM (Ollama), intercepting every prompt and every generated output to decide whether code should be auto-applied, sent for human review, or deferred with clarification questions. Instead of blindly trusting AI-generated code, TAOL computes a Composite Trust Score (CTS) from 4 post-execution risk signals: Static Analysis Gate (SAG), Function Overlap (FO), CodeBLEU (CB), and Dependency Volatility (DV). It then routes the output through one of three decision zones.",
      "The system operates as a 6-phase pipeline: (1) an Intent Gate pre-screens prompts using a Random Forest classifier trained on 24 handcrafted semantic features achieving 99.2% accuracy and 0.999 AUC, (2) a Context Enricher performs RAG-based prompt augmentation via BM25 search and git diffs for borderline prompts, (3) an Ollama Proxy streams code generation with circuit-breaker protection, (4) a Trust Calibrator computes 4 post-execution risk signals, (5) a Decision Engine applies learned CTS weights to route output, and (6) a Handover Manager formats rich briefings with LLM-generated explanations for human review.",
      "CTS weights were learned via an ensemble of Logistic Regression, Random Forest, and Gradient Boosting with grid search on 500 SWE-bench Verified tasks from 12 major Python repositories (Django, Flask, scikit-learn, sympy, etc.). CodeBLEU emerged as the dominant signal with weight 0.5465. The system includes adaptive weight retraining, per-session Human-Over-The-Loop (HOTL) trust modifiers, live AST indexing with file watching, and a full evaluation framework with ablation studies.",
      "Built as a course project for COMS E6156: Topics in Software Engineering at Columbia University, co-authored with Anisha Apte and Shruti Bhamidipati. The project includes 144 unit tests, comprehensive API endpoints, and can be deployed as a drop-in proxy server, interactive CLI, or embedded Python library.",
    ],
    highlights: [
      "6-phase trust pipeline: Intent Gate → Context Enricher → Ollama Proxy → Trust Calibrator → Decision Engine → Handover Manager",
      "Intent Gate classifier: 99.2% accuracy, 0.999 AUC, 99.4% held-out accuracy using 24 handcrafted semantic features",
      "Benchmarked on 500 SWE-bench Verified tasks from 12 real-world Python repositories with gold patches",
      "Learned CTS weights via ensemble ML: SAG (0.089), FO (0.270), CB (0.547), DV (0.094)",
      "5-experiment ablation study confirming CodeBLEU as the dominant discriminator between safe and risky patches",
      "Session-adaptive HOTL trust modifier (±0.15) that shifts thresholds based on developer feedback",
      "Live codebase indexing via tree-sitter AST parsing with watchdog-based file watching for incremental reindexing",
      "144 unit tests covering all modules with full evaluation reproducibility scripts",
      "Three deployment modes: drop-in proxy server (FastAPI), interactive CLI (Rich), or embeddable Python library",
    ],
    codeSnippet: {
      language: "python",
      filename: "orchestrator.py",
      code: `class TrustOrchestrator:
    """Embeddable trust-aware orchestration layer."""

    async def evaluate(self, prompt: str) -> HandoverResult:
        # Phase 1: Intent analysis (24-feature RF classifier)
        intent = await intent_gate.analyze(prompt, self.config, self.ast_index)
        if intent.should_defer:
            return handover_manager.defer(intent.clarification_questions)

        # Phase 2: Context enrichment for borderline prompts
        if intent.should_enrich:
            enriched = context_enricher.enrich(prompt, intent, self.bm25_index)

        # Phase 3: LLM generation with circuit breaker
        generation = await ollama_proxy.generate(active_prompt, session)

        # Phase 4: Post-generation trust analysis (SAG, FO, CB, DV)
        trust = await trust_calibrator.analyze(generation, self.config)

        # Phase 5: CTS computation and zone routing
        cts = decision_engine.compute_cts(trust, self.config.weights)

        # Phase 6: Route to auto_apply | human_review | defer_to_human
        return handover_manager.route(generation, cts, trust)`,
    },
    images: [
      "/projects/taol/taol_9.jpg",
      "/projects/taol/taol_8.png",
      "/projects/taol/taol_3.png",
      "/projects/taol/taol_venn.png",
      "/projects/taol/taol_results.png",
      "/projects/taol/taol_5.png",
    ],
  },
  {
    title: "Brandeis: Privacy Technology Advisor",
    slug: "brandeis",
    description:
      "Interactive decision-support tool that analyzes 11 user-defined constraints across privacy goals, data sensitivity, trust models, and regulatory regimes to recommend optimal privacy-enhancing technologies with explainable reasoning.",
    technologies: ["React 19", "Vite", "Tailwind CSS", "JavaScript", "Rule Engine", "Privacy Engineering"],
    demo: "https://brandeis-two.vercel.app/",
    period: "March - April 2026",
    year: 2026,
    category: ["swe"],
    longDescription: [
      "Brandeis is a privacy-preserving technology recommendation tool named after Justice Louis Brandeis, a pioneer of privacy law. It guides users through 11 structured questions covering collaboration goals, data types, sensitivity levels, party count, trust models, data mobility constraints, output requirements, accuracy tolerance, regulatory regimes, compute resources, and adversary threat models , then recommends the optimal combination of privacy-enhancing technologies.",
      "The recommendation engine evaluates across 10 privacy-enhancing technologies: k-Anonymity, Local Differential Privacy, Central Differential Privacy, Secure Multi-Party Computation (MPC), Homomorphic Encryption (HE), Trusted Execution Environments (TEE), Private Set Intersection (PSI), Federated Learning, Synthetic Data Generation, and Data Use Agreements. Each technology entry includes detailed descriptions, strengths, limitations, and real-world use cases.",
      "The core rule engine implements a multi-pass evaluation: each of the 11 question dimensions triggers specific recommendation rules that produce primary and supporting technology suggestions with sub-decisions (implementation guidance). After deduplication, cross-cutting rules handle interactions between dimensions — for example, exact accuracy requirements with DP generate compatibility warnings, while minimal resources remove HE from consideration. The engine also detects known technology stack combinations like 'Privacy-Preserving Collaborative Learning' (Federated Learning + Local DP) and 'Private Record Linkage' (PSI + MPC).",
      "Beyond recommendations, Brandeis provides a full decision tree visualization showing which user choices led to each recommendation, contextual explanations for every technology suggestion, a \"Why Not?\" panel explaining why certain technologies were excluded, and a feedback mechanism. Built as a course project for Policy in Privacy Technology at Columbia University.",
    ],
    highlights: [
      "11-question decision framework covering goals, data types, sensitivity, trust models, regulatory regimes, and threat models",
      "10 privacy-enhancing technologies with detailed profiles: k-Anonymity, Local DP, Central DP, MPC, HE, TEE, PSI, Federated Learning, Synthetic Data, DUAs",
      "Rule engine with 600+ lines of domain logic implementing multi-pass evaluation with cross-cutting constraint handling",
      "Decision tree visualization showing the causal chain from user choices to technology recommendations",
      "Explainable 'Why Not?' panel detailing why each non-recommended technology was excluded",
      "Stack detection for known technology combinations (e.g., FL + Local DP, PSI + MPC)",
      "Fully browser-based. No backend, no ML, no external APIs. Pure deterministic rule evaluation.",
      "Responsive UI with progress tracking, contextual helper text, and real-time recommendation generation",
    ],
    codeSnippet: {
      language: "javascript",
      filename: "rules.js",
      code: `export function recommend(answers) {
  const recs = [];
  const { goal, sensitivity, trustModel, numParties,
          canDataLeave, accuracy, regulatory, resources } = answers;

  // Goal drives primary technology selection
  if (goal === "train_ml") {
    recs.push(makeRec("federated_learning", "primary", ["ml_requires_fl"]));
    recs.push(makeRec("local_dp", "supporting", ["fl_needs_dp_gradients"]));
  }
  if (goal === "record_linkage") {
    recs.push(makeRec("psi", "primary", ["linkage_psi"]));
    recs.push(makeRec("mpc", "supporting", ["linkage_mpc_stack"]));
  }

  // Cross-cutting: exact accuracy + DP → warning
  if (accuracy === "exact" && hasDifferentialPrivacy(recs)) {
    warnings.push(makeWarning("DP adds noise, consider MPC or TEEs"));
  }

  // Deduplicate, detect known stacks, apply resource constraints
  return [...deduplicateRecs(recs), ...warnings];
}`,
    },
    images: [
      "/projects/brandeis/brandeis_8.png",
      "/projects/brandeis/brandeis_2.png",
      "/projects/brandeis/brandeis_5.png",
      "/projects/brandeis/brandeis_6.png",
      "/projects/brandeis/brandeis_4.png",
    ],
  },
  {
    title: "FuelForm (Snapdragon Hack)",
    slug: "fuelform-snapdragon-hack-",
    description:
      "Adaptive fitness and nutrition planning system that automates workout and dietary decisions using three AI/ML agents across an Android app and laptop compute node, synced via Firebase.",
    technologies: ["Android", "Kotlin", "Firebase", "Python", "AI/ML", "Snapdragon S25 Elite", "Health Connect"],
    github: "https://github.com/KartikDaGreat/FuelForm",
    period: "February 2026",
    year: 2026,
    category: ["ml", "swe"],
    longDescription: [
      "FuelForm models fitness as a dynamic system where a user's physical state evolves over time. The application uses three AI/ML agents working together across devices to deliver personalized, low-effort fitness optimization, reducing the cognitive burden of planning workouts and meals by continuously adapting recommendations based on user behavior, recovery, and progress.",
      "The Android app collects user health data through Android Health Connect and runs a lightweight general AI model locally on-device for fast decisions and coordination. A connected laptop acts as the primary compute hub running three dedicated AI/ML agents: a Nutrition Agent that adapts calorie targets, macro emphasis, and hydration goals; a Fitness Agent that adjusts workout intensity, duration, exercise categories, and rest days; and a Chat Q&A Agent that answers health and fitness questions. Firebase serves as the backend and real-time synchronization layer.",
      "Key features include sign-up/login for data security, initial self-reporting of preferences and health goals, a home screen with cat-meme-based adherence visualization, a chat interface for the Q&A agent, personalized nutrition plans accounting for dietary restrictions, weekly exercise plans split across workout types, a reminders screen with push notifications for meal/water/exercise logging, and a bonus donut finder feature showing nearby donut shops.",
      "Built during the Snapdragon Hackathon at Columbia University with a team of 5. The project runs on Snapdragon S25 Elite hardware for on-device inference and includes dedicated unit tests and thorough documentation.",
    ],
    highlights: [
      "3 AI/ML agents: Nutrition Agent, Fitness Agent, and Chat Q&A Agent working across devices",
      "On-device AI inference on Snapdragon S25 Elite for fast, privacy-preserving local decisions",
      "Android Health Connect integration for real-time health data collection",
      "Firebase real-time sync between Android app and laptop compute node",
      "Adaptive recommendations that evolve based on user behavior, recovery, and adherence",
      "Push notification system for meal, hydration, and exercise reminders",
      "Cat-meme-based adherence visualization on the home screen",
    ],
    codeSnippet: {
      language: "kotlin",
      filename: "AgentSync.kt",
      code: `class AgentSync(private val firebase: FirebaseDatabase) {
    private val nutritionAgent = NutritionAgent()
    private val fitnessAgent = FitnessAgent()
    private val chatAgent = ChatQAAgent()

    suspend fun syncRecommendations(userId: String) {
        val userState = firebase.getReference("users/$userId/state")
            .get().await().getValue<UserState>()

        val nutrition = nutritionAgent.adapt(
            userState.dietaryRestrictions,
            userState.calorieHistory,
            userState.adherenceScore
        )
        val fitness = fitnessAgent.adapt(
            userState.recoveryMetrics,
            userState.workoutHistory,
            userState.progressTrend
        )

        firebase.getReference("users/$userId/recommendations")
            .setValue(Recommendations(nutrition, fitness))
    }
}`,
    },
  },
  {
    title: "Mind Duelist: AI Adversarial Interviewer",
    slug: "mind-duelist-ai-adversarial-interviewer",
    description:
      "Real-time voice-based technical interviewer that detects bluffing, maps knowledge gaps, and dynamically escalates follow-up questions using LLM-driven gap analysis and live scoring.",
    technologies: ["React", "TypeScript", "ElevenLabs", "Gemini Flash", "Supabase", "Edge Functions", "AI/ML"],
    github: "https://github.com/KartikDaGreat/NightmareBot",
    period: "February 2026",
    year: 2026,
    category: ["ml", "swe"],
    longDescription: [
      "Mind Duelist is a voice-based AI technical interviewer that conducts adversarial interviews in real-time. Unlike standard interview prep tools that follow scripted question lists, Mind Duelist actively listens to responses, detects when candidates are bluffing or giving surface-level answers, and dynamically escalates follow-up questions to probe genuine understanding.",
      "The system uses ElevenLabs for natural text-to-speech voice synthesis and Gemini Flash for rapid LLM inference to analyze responses in real-time. When a candidate provides an answer, the system evaluates coherence against conversation history, assesses technical depth relative to the topic, checks consistency with prior statements, and identifies specific knowledge gaps. If bluffing is detected, the interviewer escalates difficulty; if the answer is genuine, it explores deeper into the topic.",
      "The backend runs on Supabase with Edge Functions for serverless processing, enabling low-latency voice-to-analysis pipelines. The React frontend provides a live interview interface with real-time scoring, knowledge gap visualization, and post-interview analytics showing strengths and areas for improvement.",
      "The project name 'NightmareBot' reflects the interviewer's adversarial design philosophy: it's meant to challenge candidates far beyond what a typical interviewer would, making real interviews feel easy by comparison.",
    ],
    highlights: [
      "Real-time voice interaction using ElevenLabs TTS and speech recognition",
      "LLM-powered bluff detection analyzing coherence, technical depth, and consistency",
      "Dynamic question escalation that adapts difficulty based on detected knowledge gaps",
      "Live scoring and knowledge gap mapping during the interview",
      "Supabase Edge Functions for low-latency serverless processing",
      "Post-interview analytics with strengths and improvement areas",
      "Adversarial design philosophy: makes real interviews feel easy by comparison",
    ],
    codeSnippet: {
      language: "typescript",
      filename: "bluff-detector.ts",
      code: `async function analyzeResponse(
  answer: string,
  topic: string,
  history: QAPair[]
): Promise<BluffAnalysis> {
  const coherence = await measureCoherence(answer, history);
  const depth = assessTechnicalDepth(answer, topic);
  const consistency = checkConsistency(answer, history);

  const isBluffing =
    coherence < 0.4 || depth < 0.3 || consistency < 0.5;

  return {
    verdict: isBluffing ? "BLUFF_DETECTED" : "GENUINE",
    confidence: 1 - Math.min(coherence, depth, consistency),
    nextAction: isBluffing
      ? "ESCALATE_DIFFICULTY"
      : "EXPLORE_DEEPER",
    knowledgeGaps: extractGaps(answer, topic),
  };
}`,
    },
  },
  {
    title: "On-Device Document Classification",
    slug: "on-device-document-classification",
    description:
      "Lightweight CNN framework for classifying documents based on visual layout and limited text, designed for on-device deployment with only 3.7M parameters. Published at IEEE ISEC-2025.",
    technologies: ["Python", "TensorFlow", "CNN", "Computer Vision", "On-Device ML"],
    period: "January - May 2024",
    year: 2024,
    paper: "https://ieeexplore.ieee.org/abstract/document/10696508",
    category: ["ml"],
    accuracy: "3.7M parameters | Published at ISEC-2025",
    longDescription: [
      "This research project developed a lightweight deep learning framework for document classification that operates on-device without requiring cloud connectivity. The key challenge was building a model compact enough for edge deployment while maintaining classification accuracy across diverse document types.",
      "The framework uses a custom CNN architecture with only 3.7 million parameters (significantly smaller than standard document classification models) by combining visual layout features from document images with limited extracted text features. This dual-modality approach allows the model to classify documents even when OCR quality is poor or text content is minimal, such as with forms, invoices, receipts, and ID documents.",
      "The model was designed for real-world deployment scenarios where documents need to be classified at the point of capture: on mobile devices, embedded systems, or in air-gapped environments where data cannot be sent to cloud APIs. The architecture prioritizes inference speed and memory efficiency without sacrificing accuracy.",
      "The research was published at the IEEE International Symposium on Electronics and Communications (ISEC-2025) and presented at the ICOICI conference.",
    ],
    highlights: [
      "3.7M parameter model, lightweight enough for mobile and edge device deployment",
      "Dual-modality approach combining visual layout features with limited text extraction",
      "Designed for air-gapped and offline environments where cloud APIs are unavailable",
      "Published at IEEE ISEC-2025 (International Symposium on Electronics and Communications)",
      "Presented at ICOICI conference with peer-reviewed publication",
      "Optimized for inference speed and memory efficiency on resource-constrained devices",
    ],
    codeSnippet: {
      language: "python",
      filename: "classifier.py",
      code: `class DocumentClassifier(tf.keras.Model):
    """Lightweight dual-modality document classifier (3.7M params)."""

    def __init__(self, num_classes: int):
        super().__init__()
        # Visual branch: lightweight CNN for document layout
        self.visual = tf.keras.Sequential([
            tf.keras.layers.Conv2D(32, 3, activation="relu"),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation="relu"),
            tf.keras.layers.GlobalAveragePooling2D(),
        ])
        # Text branch: embedding + dense for limited OCR text
        self.text_embed = tf.keras.layers.Embedding(10000, 64)
        self.text_dense = tf.keras.layers.Dense(128, activation="relu")
        # Fusion and classification
        self.classifier = tf.keras.layers.Dense(num_classes, activation="softmax")

    def call(self, image, text):
        visual_features = self.visual(image)
        text_features = self.text_dense(self.text_embed(text))
        fused = tf.concat([visual_features, text_features], axis=-1)
        return self.classifier(fused)`,
    },
  },
  {
    title: "Psychological Counselling Chatbot",
    slug: "psychological-counselling-chatbot",
    description:
      "Tri-modal chatbot for assessing patients' mental states through text, voice, and facial expression analysis, achieving 87% user satisfaction in clinical evaluations. Published at ACM ICAISS-2024.",
    technologies: ["Python", "Flask", "AngularJS", "NLP", "Speech Analysis", "Computer Vision", "AI/ML"],
    period: "January - March 2024",
    year: 2024,
    paper: "https://dl.acm.org/doi/10.1145/3717383.3717387",
    category: ["ml"],
    accuracy: "87% satisfaction",
    longDescription: [
      "This research project built a tri-modal chatbot system designed to assist in psychological counselling by analyzing patients' mental states through three simultaneous input channels: text conversations, voice tone analysis, and facial expression recognition. The system provides a more holistic assessment than text-only chatbots by capturing emotional signals across modalities.",
      "The text modality uses NLP techniques to analyze sentiment, detect distress indicators, and identify cognitive patterns in patient responses. The voice modality processes speech characteristics including tone, pace, pitch variations, and hesitation patterns that correlate with emotional states. The facial expression modality uses computer vision to detect micro-expressions and emotional indicators during video sessions.",
      "The three modalities are fused using a weighted ensemble approach that produces a composite mental state assessment. This multi-modal fusion allows the system to detect discrepancies (for example, when a patient says they're 'fine' but their voice trembles and facial expressions show distress), providing counsellors with deeper insight than any single modality alone.",
      "The system achieved 87% user satisfaction in clinical evaluations and was published at ACM ICAISS-2024 (International Conference on Artificial Intelligence and Smart Systems).",
    ],
    highlights: [
      "Tri-modal analysis: text sentiment, voice tone, and facial expression recognition",
      "NLP-based distress detection and cognitive pattern identification in conversations",
      "Voice analysis capturing tone, pace, pitch variations, and hesitation patterns",
      "Computer vision for micro-expression detection and emotional state classification",
      "Weighted multi-modal fusion for composite mental state assessment",
      "87% user satisfaction rate in clinical evaluations",
      "Published at ACM ICAISS-2024 (International Conference on AI and Smart Systems)",
    ],
    codeSnippet: {
      language: "python",
      filename: "multimodal_fusion.py",
      code: `class TriModalAssessor:
    """Fuses text, voice, and facial signals for mental state assessment."""

    def __init__(self):
        self.text_analyzer = SentimentAnalyzer()
        self.voice_analyzer = VoiceEmotionDetector()
        self.face_analyzer = FacialExpressionClassifier()

    def assess(self, text: str, audio: np.ndarray, frame: np.ndarray):
        text_score = self.text_analyzer.analyze(text)
        voice_score = self.voice_analyzer.analyze(audio)
        face_score = self.face_analyzer.classify(frame)

        # Detect modality discrepancies (e.g., "I'm fine" + distressed voice)
        discrepancy = abs(text_score.valence - voice_score.valence)

        composite = MentalStateAssessment(
            text=text_score,
            voice=voice_score,
            facial=face_score,
            distress_level=weighted_fusion(text_score, voice_score, face_score),
            modality_conflict=discrepancy > 0.4,
        )
        return composite`,
    },
  },
  {
    title: "Skin Cancer Detection Ensemble",
    slug: "skin-cancer-detection-ensemble",
    description:
      "Ensemble deep learning model combining ResNet-50, EfficientNet-B3, and MobileNetV2 for dermatological image classification, achieving 96.33% accuracy on skin lesion detection.",
    technologies: ["Python", "PyTorch", "ResNet", "EfficientNet", "MobileNet", "Transfer Learning"],
    period: "October - December 2023",
    year: 2023,
    category: ["ml"],
    accuracy: "96.33%",
    longDescription: [
      "This project developed an ensemble deep learning approach for automated skin cancer detection from dermatological images. The system combines three pre-trained convolutional neural networks (ResNet-50, EfficientNet-B3, and MobileNetV2), each bringing different architectural strengths to the classification task.",
      "ResNet-50 provides deep feature extraction through residual connections that prevent gradient degradation. EfficientNet-B3 offers compound-scaled architecture optimized for accuracy-to-compute ratio. MobileNetV2 contributes efficient depthwise separable convolutions suited for deployment. All three models were fine-tuned on dermoscopic images using transfer learning from ImageNet weights.",
      "The ensemble uses a weighted voting strategy where each model's prediction confidence contributes to the final classification. This approach achieves 96.33% accuracy (outperforming any individual model in the ensemble) by leveraging the complementary strengths of each architecture and reducing the impact of individual model weaknesses on edge cases.",
      "The model classifies across multiple categories of skin lesions including melanoma, basal cell carcinoma, and benign conditions, providing clinicians with a decision-support tool for early detection of malignant lesions.",
    ],
    highlights: [
      "96.33% accuracy through ensemble of ResNet-50, EfficientNet-B3, and MobileNetV2",
      "Transfer learning from ImageNet with fine-tuning on dermoscopic images",
      "Weighted voting ensemble outperforming any individual model component",
      "Multi-class classification: melanoma, basal cell carcinoma, and benign lesions",
      "Designed as a clinician decision-support tool for early malignancy detection",
    ],
    codeSnippet: {
      language: "python",
      filename: "ensemble.py",
      code: `class SkinCancerEnsemble(nn.Module):
    """Weighted ensemble of ResNet-50, EfficientNet-B3, MobileNetV2."""

    def __init__(self, num_classes: int):
        super().__init__()
        self.resnet = models.resnet50(pretrained=True)
        self.effnet = models.efficientnet_b3(pretrained=True)
        self.mobilenet = models.mobilenet_v2(pretrained=True)

        # Replace classification heads
        self.resnet.fc = nn.Linear(2048, num_classes)
        self.effnet.classifier[1] = nn.Linear(1536, num_classes)
        self.mobilenet.classifier[1] = nn.Linear(1280, num_classes)

        # Learned ensemble weights
        self.weights = nn.Parameter(torch.ones(3) / 3)

    def forward(self, x):
        w = F.softmax(self.weights, dim=0)
        preds = (w[0] * self.resnet(x) +
                 w[1] * self.effnet(x) +
                 w[2] * self.mobilenet(x))
        return preds`,
    },
  },
  {
    title: "Fake News Origin Detection",
    slug: "fake-news-origin-detection",
    description:
      "NLP-based machine learning system for detecting the origins and propagation patterns of misinformation, achieving 96.3% accuracy using linguistic feature analysis and source credibility scoring.",
    technologies: ["Python", "NLP", "Scikit-learn", "NLTK", "TF-IDF", "Feature Engineering"],
    period: "March - May 2024",
    year: 2024,
    category: ["ml"],
    accuracy: "96.3%",
    longDescription: [
      "This project built a machine learning system that goes beyond simple fake news detection to identify the origins and propagation patterns of misinformation. While most fake news detectors classify individual articles as true or false, this system traces misinformation back to its source by analyzing linguistic fingerprints, writing style patterns, and source credibility signals.",
      "The system employs a multi-stage NLP pipeline: text preprocessing with NLTK for tokenization and normalization, TF-IDF vectorization for content representation, linguistic feature extraction capturing stylometric patterns (sentence complexity, vocabulary richness, punctuation usage), and source credibility scoring based on domain reputation and historical accuracy.",
      "Multiple classifiers were evaluated including logistic regression, random forest, gradient boosting, and SVM. The final system uses an optimized ensemble approach achieving 96.3% accuracy on the test set. Feature importance analysis revealed that linguistic style features and source credibility signals were more predictive than content-based features alone, suggesting that how misinformation is written matters as much as what it says.",
    ],
    highlights: [
      "96.3% accuracy in detecting fake news origins and propagation patterns",
      "Multi-stage NLP pipeline: preprocessing, TF-IDF, linguistic features, source credibility",
      "Stylometric analysis capturing writing patterns, vocabulary richness, and complexity metrics",
      "Source credibility scoring based on domain reputation and historical accuracy",
      "Feature importance analysis revealing linguistic style as more predictive than content alone",
      "Ensemble classifier outperforming individual models across all metrics",
    ],
    codeSnippet: {
      language: "python",
      filename: "origin_detector.py",
      code: `class FakeNewsOriginDetector:
    """Traces misinformation origins via linguistic fingerprinting."""

    def __init__(self):
        self.tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 3))
        self.classifier = GradientBoostingClassifier(n_estimators=200)

    def extract_features(self, text: str) -> np.ndarray:
        content = self.tfidf.transform([text]).toarray()
        linguistic = np.array([
            flesch_reading_ease(text),
            vocabulary_richness(text),
            avg_sentence_length(text),
            punctuation_density(text),
            hedging_word_frequency(text),
        ])
        credibility = self.score_source_credibility(text)
        return np.concatenate([content[0], linguistic, [credibility]])

    def predict_origin(self, article: str) -> OriginResult:
        features = self.extract_features(article)
        prediction = self.classifier.predict_proba([features])[0]
        return OriginResult(
            is_fake=prediction[1] > 0.5,
            confidence=max(prediction),
            source_pattern=self.trace_propagation(article),
        )`,
    },
  },
  {
    title: "Traffic Speed Detection System",
    slug: "traffic-speed-detection-system",
    description:
      "Automated speeding ticket framework for NHAI (National Highways Authority of India) using computer vision for vehicle detection, speed estimation, and license plate recognition.",
    technologies: ["Python", "OpenCV", "YOLO", "Computer Vision", "IoT", "OCR"],
    period: "August - December 2023",
    year: 2023,
    category: ["swe", "ml"],
    longDescription: [
      "This project developed an automated speed enforcement system designed for Indian national highways (NHAI). The system uses a camera-based pipeline to detect vehicles, estimate their speed using frame-by-frame displacement analysis, and automatically generate speeding tickets by reading license plates with OCR.",
      "The vehicle detection module uses YOLO (You Only Look Once) for real-time object detection, identifying and tracking individual vehicles across consecutive frames. Speed estimation is computed by measuring pixel displacement between frames, calibrated against known road dimensions and camera geometry to convert to real-world speed values.",
      "When a vehicle exceeds the speed limit, the system captures a high-resolution frame, runs OCR-based license plate recognition to extract the vehicle registration number, and generates an automated ticket record with timestamp, speed reading, location, and photographic evidence. The system is designed for deployment on IoT edge devices at highway checkpoints.",
    ],
    highlights: [
      "YOLO-based real-time vehicle detection and tracking across video frames",
      "Speed estimation via frame displacement analysis calibrated to road geometry",
      "OCR-based automatic license plate recognition for ticket generation",
      "Designed for NHAI highway deployment on IoT edge devices",
      "End-to-end pipeline: detection → tracking → speed estimation → plate reading → ticket generation",
    ],
    codeSnippet: {
      language: "python",
      filename: "speed_detector.py",
      code: `class SpeedDetector:
    """Estimates vehicle speed from video using YOLO + displacement."""

    def __init__(self, calibration: CameraCalibration):
        self.detector = YOLO("yolov8n.pt")
        self.tracker = VehicleTracker()
        self.calibration = calibration
        self.plate_reader = LicensePlateOCR()

    def process_frame(self, frame: np.ndarray, timestamp: float):
        detections = self.detector(frame)
        for vehicle in self.tracker.update(detections, timestamp):
            speed_kmh = self.calibration.pixels_to_speed(
                vehicle.displacement, vehicle.time_delta
            )
            if speed_kmh > self.speed_limit:
                plate = self.plate_reader.extract(frame, vehicle.bbox)
                self.generate_ticket(plate, speed_kmh, timestamp)`,
    },
  },
  {
    title: "Chota-Dhobi Mobile App",
    slug: "chota-dhobi-mobile-app",
    description:
      "On-demand laundry services mobile application with real-time order tracking, dynamic pricing, scheduling, and multi-vendor management built with Firebase backend.",
    technologies: ["Firebase", "Android", "Java", "Firestore", "Cloud Functions", "Google Maps API"],
    github: "https://github.com/KartikDaGreat",
    period: "June - August 2023",
    year: 2023,
    category: ["swe"],
    longDescription: [
      "Chota-Dhobi ('Small Washerman' in Hindi) is a full-stack mobile application for on-demand laundry services, connecting customers with local laundry vendors. The app handles the complete service lifecycle from order placement to pickup, washing, and delivery with real-time tracking at each stage.",
      "The customer-facing app allows users to schedule pickups, select service types (wash, dry clean, iron), set preferences, track orders in real-time via Google Maps integration, and manage payments. The vendor side includes order management, capacity planning, and delivery route optimization.",
      "The backend is entirely Firebase-based using Firestore for real-time database operations, Cloud Functions for server-side logic (pricing calculations, notification dispatch, order state management), and Firebase Authentication for user management. The real-time sync capabilities of Firestore enable instant order status updates across all connected devices.",
    ],
    highlights: [
      "Full-stack mobile app connecting customers with local laundry vendors",
      "Real-time order tracking with Google Maps integration for pickup and delivery",
      "Dynamic pricing engine based on service type, garment quantity, and urgency",
      "Firebase-based backend: Firestore, Cloud Functions, Authentication",
      "Multi-vendor management with capacity planning and route optimization",
      "Complete order lifecycle: placement → pickup → processing → delivery",
    ],
  },
  {
    title: "UrbanistAI: ML Data Labeling Platform",
    slug: "urbanistai",
    description:
      "Full-stack ML data collection and labeling platform with privacy-preserving image processing, interactive bounding box annotation, and role-based workspace management for university courses.",
    technologies: ["React 18", "FastAPI", "PostgreSQL", "Google Cloud", "MediaPipe", "MTCNN", "RetinaFace", "Konva.js", "EasyOCR"],
    period: "January - May 2026",
    year: 2026,
    category: ["ml", "swe"],
    longDescription: [
      "UrbanistAI is a production-grade data collection and labeling platform built for Columbia University's AiX Convergence Design Studio. The platform enables students to collaboratively upload, process, and label images for computer vision research while automatically enforcing privacy protections through ensemble face detection and text blurring.",
      "When images are uploaded, an automated privacy pipeline processes them through three face detection models (MTCNN, RetinaFace, and MediaPipe) in an ensemble configuration, plus EasyOCR for text detection. Detected faces and text regions are automatically blurred, and all EXIF metadata is stripped before storage. This privacy-first approach ensures that no personally identifiable information persists in the dataset.",
      "The labeling interface uses a Konva.js canvas for interactive bounding box annotation with fuzzy search label suggestions, abstract label classes for semantic grouping, and real-time statistics. The platform supports role-based access control (Student, TA, Admin) with JWT authentication, workspace-based isolation for semester/year scoping, and a gallery with filtering by label, uploader, and date.",
      "The backend runs on FastAPI with SQLAlchemy ORM and PostgreSQL (Cloud SQL), deployed on Google Cloud Run. Image storage uses Google Cloud Storage with signed URL caching for security. The system includes lazy-loaded ML model singletons, optimized database pooling, and a markdown-based instruction system for course administrators. Built in collaboration with Jenny Leana Fotso Ngompe under Prof. Anthony Vanky and Prof. Tian Zheng.",
    ],
    highlights: [
      "Ensemble face detection pipeline: MTCNN + RetinaFace + MediaPipe for robust privacy protection",
      "EasyOCR-based text detection and blurring with automatic EXIF metadata stripping",
      "Interactive Konva.js bounding box labeling canvas with fuzzy search and label suggestions",
      "Role-based access control (Student/TA/Admin) with JWT authentication and workspace isolation",
      "Google Cloud deployment: Cloud Run (backend), Cloud SQL (PostgreSQL), GCS (image storage with signed URLs)",
      "Lazy-loaded ML model singletons with optimized database pooling (10 connections, 5 overflow)",
      "Real-time statistics dashboard, gallery with multi-filter search, and markdown instruction system",
    ],
    codeSnippet: {
      language: "python",
      filename: "image_processing.py",
      code: `class PrivacyProcessor:
    """Ensemble face + text detection with automatic blurring."""

    def __init__(self):
        self.mtcnn = MTCNN()
        self.retinaface = RetinaFace()
        self.mediapipe = mp.solutions.face_detection.FaceDetection()
        self.ocr = easyocr.Reader(["en"])

    def process(self, image: np.ndarray) -> np.ndarray:
        # Ensemble face detection: union of all detections
        faces = set()
        faces.update(self.mtcnn.detect(image))
        faces.update(self.retinaface.detect(image))
        faces.update(self.mediapipe.detect(image))

        # Text region detection
        text_regions = self.ocr.detect(image)

        # Apply gaussian blur to all detected regions
        for region in faces | text_regions:
            image = apply_blur(image, region, method="gaussian")

        # Strip EXIF metadata and resize
        image = strip_exif(image)
        return resize_max(image, max_dim=1024)`,
    },
  },
  {
    title: "Personal Portfolio Website",
    slug: "personal-portfolio-website",
    description:
      "Interactive developer portfolio featuring a fully functional terminal emulator, encrypted file management system, dynamic theming, and real-time integrations with GitHub, Vercel, and Arduino IoT.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Arduino", "Vercel API"],
    github: "https://github.com/KartikDaGreat/kartikgounder-website",
    period: "2025 - Present",
    year: 2025,
    category: ["swe"],
    longDescription: [
      "This portfolio website goes beyond a typical developer portfolio by embedding interactive systems directly into the browsing experience. The centerpiece is a fully functional terminal emulator that supports command execution, file system navigation, and system queries. Visitors can interact with the site through a CLI interface alongside the traditional GUI.",
      "The site includes an encrypted file management system with upload, download, move, and delete operations backed by Supabase storage. A visitor tracking system logs and displays visit counts. Real-time integrations pull data from GitHub (contribution activity), Vercel (deployment status), and an Arduino IoT device (hardware status monitoring).",
      "The dynamic theming system supports multiple color schemes that persist across sessions. The architecture uses Next.js App Router with server-side rendering for SEO, API routes for backend functionality, and responsive design that adapts from mobile to desktop. The entire site is deployed on Vercel with automatic deployments from the main branch.",
    ],
    highlights: [
      "Fully functional terminal emulator with command execution and file system navigation",
      "Encrypted file management system with Supabase storage backend",
      "Real-time GitHub activity, Vercel deployment status, and Arduino IoT integrations",
      "Dynamic theming system with persistent color scheme preferences",
      "Visitor tracking and analytics system",
      "Next.js App Router with SSR, API routes, and responsive design",
      "Donut shop finder API, because every developer needs donuts",
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug)
}
