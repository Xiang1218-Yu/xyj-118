import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Compass, ArrowRight, ArrowLeft, Check, X, Home } from '../components/Icons';
import { HeartParticles } from '../components/HeartParticles';
import { RadarChart } from '../components/RadarChart';
import quizzesData from '../data/quizzes.json';
import type { Quiz, QuizTheme, PlayerAnswer, QuizResult } from '../types';

const quizzes = quizzesData as Quiz[];

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles size={28} className="text-white" />,
  Heart: <Heart size={28} className="text-white" fill="currentColor" />,
  Compass: <Compass size={28} className="text-white" />,
};

const getDimensionScores = (
  theme: QuizTheme,
  p1Answers: PlayerAnswer[],
  p2Answers: PlayerAnswer[]
): { dimension: string; score: number }[] => {
  const optionScore: Record<string, number> = { a: 100, b: 75, c: 50, d: 25 };

  if (theme === 'chemistry') {
    return [
      { dimension: '生活习惯', score: calculateMatch(p1Answers[0], p2Answers[0], optionScore) },
      { dimension: '喜好了解', score: calculateMatch(p1Answers[1], p2Answers[1], optionScore) },
      { dimension: '相处模式', score: calculateMatch(p1Answers[2], p2Answers[2], optionScore) },
      { dimension: '兴趣爱好', score: calculateMatch(p1Answers[3], p2Answers[3], optionScore) },
      { dimension: '雷区认知', score: calculateMatch(p1Answers[4], p2Answers[4], optionScore) },
      { dimension: '需求感知', score: calculateMatch(p1Answers[5], p2Answers[5], optionScore) },
    ];
  }

  if (theme === 'love') {
    return [
      { dimension: '牺牲精神', score: calculateMatch(p1Answers[0], p2Answers[0], optionScore) },
      { dimension: '关心程度', score: calculateMatch(p1Answers[1], p2Answers[1], optionScore) },
      { dimension: '公开认可', score: calculateMatch(p1Answers[2], p2Answers[2], optionScore) },
      { dimension: '未来规划', score: calculateMatch(p1Answers[3], p2Answers[3], optionScore) },
      { dimension: '包容程度', score: calculateMatch(p1Answers[4], p2Answers[4], optionScore) },
      { dimension: '灵魂契合', score: calculateMatch(p1Answers[5], p2Answers[5], optionScore) },
    ];
  }

  return [
    { dimension: '金钱观', score: calculateMatch(p1Answers[0], p2Answers[0], optionScore) },
    { dimension: '事业家庭', score: calculateMatch(p1Answers[1], p2Answers[1], optionScore) },
    { dimension: '生育观', score: calculateMatch(p1Answers[2], p2Answers[2], optionScore) },
    { dimension: '家庭关系', score: calculateMatch(p1Answers[3], p2Answers[3], optionScore) },
    { dimension: '社交边界', score: calculateMatch(p1Answers[4], p2Answers[4], optionScore) },
    { dimension: '决策方式', score: calculateMatch(p1Answers[5], p2Answers[5], optionScore) },
  ];
};

const calculateMatch = (
  a1: PlayerAnswer | undefined,
  a2: PlayerAnswer | undefined,
  optionScore: Record<string, number>
): number => {
  if (!a1 || !a2) return 0;
  if (a1.optionId === a2.optionId) return 100;
  const s1 = optionScore[a1.optionId] || 0;
  const s2 = optionScore[a2.optionId] || 0;
  return Math.max(0, 100 - Math.abs(s1 - s2));
};

const getAnalysis = (score: number): string => {
  if (score >= 90) return '你们简直是天造地设的一对！心灵相通，默契满分，是别人眼中的神仙眷侣。继续保持这份美好，你们的未来一定会更加幸福！';
  if (score >= 75) return '你们的关系非常好，大多数时候都能理解对方。继续保持沟通，多花时间了解彼此的内心想法，你们的感情会更加深厚。';
  if (score >= 60) return '你们有一定的默契，但还有提升空间。建议多进行深度交流，了解对方的真实想法，尊重彼此的差异，这样感情会更加稳固。';
  return '你们需要更多的沟通和了解。每个人都是独特的个体，慢慢来，用心去感受对方，相信你们会找到属于你们的相处之道。';
};

const themeColors: Record<QuizTheme, string> = {
  chemistry: '#ec4899',
  love: '#ef4444',
  values: '#8b5cf6',
};

export function QuizPage() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<QuizTheme | null>(null);
  const [currentStep, setCurrentStep] = useState<'select' | 'player1' | 'player2' | 'reveal' | 'result'>('select');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [player1Answers, setPlayer1Answers] = useState<PlayerAnswer[]>([]);
  const [player2Answers, setPlayer2Answers] = useState<PlayerAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQuiz = quizzes.find((q) => q.id === selectedTheme);
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  const handleThemeSelect = (themeId: QuizTheme) => {
    setSelectedTheme(themeId);
  };

  const handleStartQuiz = useCallback(() => {
    if (!selectedTheme) return;
    setCurrentStep('player1');
    setCurrentQuestionIndex(0);
    setPlayer1Answers([]);
    setPlayer2Answers([]);
    setSelectedOption(null);
  }, [selectedTheme]);

  const handleAnswerSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (!selectedOption || !currentQuestion) return;

    const answer: PlayerAnswer = {
      questionId: currentQuestion.id,
      optionId: selectedOption,
    };

    if (currentStep === 'player1') {
      const newAnswers = [...player1Answers, answer];
      setPlayer1Answers(newAnswers);

      if (currentQuestionIndex < (currentQuiz?.questions.length ?? 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setCurrentStep('player2');
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
      }
    } else if (currentStep === 'player2') {
      const newAnswers = [...player2Answers, answer];
      setPlayer2Answers(newAnswers);

      if (currentQuestionIndex < (currentQuiz?.questions.length ?? 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setCurrentStep('reveal');
        setRevealIndex(0);
      }
    }
  };

  const handleNextReveal = () => {
    if (!currentQuiz) return;
    if (revealIndex < currentQuiz.questions.length - 1) {
      setRevealIndex(revealIndex + 1);
    } else {
      if (!selectedTheme) return;
      const dimensionScores = getDimensionScores(selectedTheme, player1Answers, player2Answers);
      const matchScore = Math.round(
        dimensionScores.reduce((sum, d) => sum + d.score, 0) / dimensionScores.length
      );
      const analysis = getAnalysis(matchScore);

      setResult({
        theme: selectedTheme,
        player1Answers,
        player2Answers,
        matchScore,
        dimensionScores,
        analysis,
      });
      setCurrentStep('result');
    }
  };

  const handleBackToSelect = () => {
    setCurrentStep('select');
    setSelectedTheme(null);
    setCurrentQuestionIndex(0);
    setPlayer1Answers([]);
    setPlayer2Answers([]);
    setSelectedOption(null);
    setResult(null);
  };

  const handleRestart = () => {
    setCurrentStep('select');
    setSelectedTheme(null);
    setCurrentQuestionIndex(0);
    setPlayer1Answers([]);
    setPlayer2Answers([]);
    setSelectedOption(null);
    setResult(null);
  };

  const getOptionText = (questionId: string, optionId: string): string => {
    const question = currentQuiz?.questions.find((q) => q.id === questionId);
    const option = question?.options.find((o) => o.id === optionId);
    return option?.text || '';
  };

  const renderThemeSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
        >
          <Heart className="text-primary" size={16} fill="currentColor" />
          <span className="text-primary text-sm font-medium">情侣专属</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
          情侣默契测验
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          选择一个测验主题，和TA一起探索你们的默契程度吧 💑
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => handleThemeSelect(quiz.id as QuizTheme)}
            className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
              selectedTheme === quiz.id
                ? 'border-primary shadow-xl shadow-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className={`bg-gradient-to-br ${quiz.color} p-6 text-white`}>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                {iconMap[quiz.icon]}
              </div>
              <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
              <p className="text-white/80 text-sm">{quiz.description}</p>
            </div>
            <div className="p-5 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {quiz.questions.length} 道题目
                </span>
                {selectedTheme === quiz.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-medium hover:bg-secondary/30 transition-all"
        >
          <Home size={18} />
          返回首页
        </button>
        <button
          onClick={handleStartQuiz}
          disabled={!selectedTheme}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
            selectedTheme
              ? 'bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          开始测验
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  const renderQuiz = (player: 1 | 2) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
            player === 1 ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
          }`}
        >
          <span className="font-medium">玩家 {player} 答题中</span>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">
          {player === 1 ? '👨 第一位请作答' : '👩 第二位请作答'}
        </h2>
        <p className="text-muted-foreground text-sm">
          请诚实回答，不要让对方看到你的答案哦 😉
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>进度</span>
          <span>
            {currentQuestionIndex + 1} / {currentQuiz?.questions.length}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentQuestionIndex + 1) / (currentQuiz?.questions.length ?? 1)) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold mb-6 text-center">
          {currentQuestion?.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion?.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerSelect(option.id)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                selectedOption === option.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    selectedOption === option.id
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {option.id.toUpperCase()}
                </div>
                <span
                  className={`${
                    selectedOption === option.id ? 'font-semibold text-foreground' : 'text-foreground/80'
                  }`}
                >
                  {option.text}
                </span>
                {selectedOption === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <Check size={20} className="text-primary" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="flex justify-between">
        <button
          onClick={handleBackToSelect}
          className="flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-medium hover:bg-secondary/30 transition-all"
        >
          <ArrowLeft size={18} />
          重新选择
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={!selectedOption}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
            selectedOption
              ? 'bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/30 hover:shadow-xl'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {currentQuestionIndex < (currentQuiz?.questions.length ?? 0) - 1
            ? '下一题'
            : '完成答题'}
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  const renderReveal = () => {
    if (!currentQuiz) return null;
    const question = currentQuiz.questions[revealIndex];
    const p1Answer = player1Answers[revealIndex];
    const p2Answer = player2Answers[revealIndex];
    const isMatch = p1Answer?.optionId === p2Answer?.optionId;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-600 rounded-full mb-4"
          >
            <Sparkles size={16} />
            <span className="font-medium">答案揭晓</span>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">第 {revealIndex + 1} 题</h2>
          <p className="text-muted-foreground">
            来看看你们的答案是否一致吧！
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 mb-8 border border-border">
          <h3 className="text-xl font-bold mb-8">{question.question}</h3>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200"
            >
              <div className="text-sm text-blue-600 font-medium mb-2">👨 玩家 1</div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-semibold text-blue-700"
              >
                {getOptionText(question.id, p1Answer?.optionId || '')}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-pink-50 rounded-xl p-5 border-2 border-pink-200"
            >
              <div className="text-sm text-pink-600 font-medium mb-2">👩 玩家 2</div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-semibold text-pink-700"
              >
                {getOptionText(question.id, p2Answer?.optionId || '')}
              </motion.div>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isMatch ? 'match' : 'diff'}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.6 }}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
                isMatch ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}
            >
              {isMatch ? (
                <>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1, repeatDelay: 1 }}
                  >
                    <Check size={24} />
                  </motion.div>
                  <span className="font-bold text-lg">默契满分！</span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ x: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5, repeatDelay: 1 }}
                  >
                    <X size={24} />
                  </motion.div>
                  <span className="font-bold text-lg">有点不一样哦~</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>揭晓进度</span>
            <span>
              {revealIndex + 1} / {currentQuiz.questions.length}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((revealIndex + 1) / currentQuiz.questions.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <button
          onClick={handleNextReveal}
          className="flex items-center gap-2 px-8 py-3 mx-auto rounded-xl font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-105 transition-all"
        >
          {revealIndex < currentQuiz.questions.length - 1 ? '下一题' : '查看结果'}
          <ArrowRight size={18} />
        </button>
      </motion.div>
    );
  };

  const renderResult = () => {
    if (!result || !currentQuiz) return null;
    const color = themeColors[result.theme];

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-primary to-pink-500 rounded-full blur-xl opacity-30"
                style={{ width: 200, height: 200, margin: -30 }}
              />
              <div
                className="relative w-40 h-40 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(${color} ${result.matchScore}%, #e5e7eb ${result.matchScore}%)`,
                }}
              >
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="text-5xl font-bold"
                    style={{ color }}
                  >
                    {result.matchScore}
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold mb-2">
            {currentQuiz.title} 结果
          </h1>
          <p className="text-muted-foreground">
            你们的契合度为 {result.matchScore}%
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-xl font-bold mb-4 text-center">雷达图分析</h3>
            <div className="flex justify-center">
              <RadarChart data={result.dimensionScores} size={280} color={color} />
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-xl font-bold mb-4 text-center">结果分析</h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-primary/5 to-pink-50 rounded-xl p-5 border border-primary/10">
                <p className="text-foreground/90 leading-relaxed">{result.analysis}</p>
              </div>

              <div className="space-y-3">
                {result.dimensionScores.map((item, index) => (
                  <motion.div
                    key={item.dimension}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.dimension}</span>
                      <span className="text-muted-foreground">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{
                          delay: 0.7 + index * 0.1,
                          duration: 0.8,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border mb-8">
          <h3 className="text-xl font-bold mb-4">答题详情</h3>
          <div className="space-y-4">
            {currentQuiz.questions.map((q, index) => {
              const p1 = result.player1Answers[index];
              const p2 = result.player2Answers[index];
              const match = p1?.optionId === p2?.optionId;

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="p-4 bg-muted/30 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        match ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {match ? <Check size={16} /> : <X size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{q.question}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-blue-600">
                          👨: {getOptionText(q.id, p1?.optionId || '')}
                        </div>
                        <div className="text-pink-600">
                          👩: {getOptionText(q.id, p2?.optionId || '')}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-medium hover:bg-secondary/30 transition-all"
          >
            <Home size={18} />
            返回首页
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 transition-all"
          >
            <Sparkles size={18} />
            再测一次
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <HeartParticles />

      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border"
        >
          <div className="container px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-10 h-10 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center"
                >
                  <Heart className="text-white" size={20} fill="currentColor" />
                </button>
                <div>
                  <h1 className="text-xl font-bold gradient-text">情侣默契测验</h1>
                  <p className="text-xs text-muted-foreground">探索你们的心灵感应</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="container px-4 py-8 md:py-12">
          <AnimatePresence mode="wait">
            {currentStep === 'select' && renderThemeSelection()}
            {currentStep === 'player1' && renderQuiz(1)}
            {currentStep === 'player2' && renderQuiz(2)}
            {currentStep === 'reveal' && renderReveal()}
            {currentStep === 'result' && renderResult()}
          </AnimatePresence>
        </main>

        <footer className="py-8 text-center text-muted-foreground text-sm">
          <p className="flex items-center justify-center gap-2">
            用心感受彼此的爱 <Heart className="text-primary" size={14} fill="currentColor" />
          </p>
        </footer>
      </div>
    </div>
  );
}
