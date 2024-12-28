"use client";
import React from "react";

function MainComponent() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coins, setCoins] = useState(0);
  const [taps, setTaps] = useState(0);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [nextSpinTime, setNextSpinTime] = useState(null);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [referralLink, setReferralLink] = useState(
    "https://minecoino.app/ref/user123"
  );
  const [referrals, setReferrals] = useState([]);
  const [signupError, setSignupError] = useState("");
  const [spinResult, setSpinResult] = useState(null);
  const [showSpinResult, setShowSpinResult] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(500);
  const [currentEnergy, setCurrentEnergy] = useState(500);
  const [energyResetTime, setEnergyResetTime] = useState(null);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [multiTapLevel, setMultiTapLevel] = useState(0);
  const [capacityLevel, setCapacityLevel] = useState(0);
  const [hasRewardBot, setHasRewardBot] = useState(false);
  const [rewardBotTimer, setRewardBotTimer] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const multiTapPrices = [
    1000, 3000, 8000, 13000, 20000, 30000, 70000, 200000, 500000, 900000,
    2000000,
  ];

  useEffect(() => {
    if (currentEnergy === 0 && !energyResetTime) {
      const resetTime = new Date();
      resetTime.setHours(resetTime.getHours() + 10);
      setEnergyResetTime(resetTime.getTime());
    }

    if (energyResetTime && currentEnergy === 0) {
      const timer = setInterval(() => {
        const now = Date.now();
        if (now >= energyResetTime) {
          setCurrentEnergy(maxEnergy);
          setEnergyResetTime(null);
        } else {
          const timeLeft = energyResetTime - now;
          const energyToRestore = Math.floor(
            (maxEnergy * (36000000 - timeLeft)) / 36000000
          );
          setCurrentEnergy(energyToRestore);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentEnergy, maxEnergy, energyResetTime]);

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  const validateEmail = (email) => {
    const validDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];
    const domain = email.split("@")[1];
    return validDomains.includes(domain);
  };
  const handleCoinClick = useCallback(() => {
    if (!isLoggedIn || currentEnergy <= 0) return;
    const multiplier = multiTapLevel + 1;
    setCurrentEnergy((prev) => prev - multiplier);
    setCoins((prev) => prev + multiplier);
    setTaps((prev) => prev + multiplier);
    if (referrals.length > 0) {
      setReferrals((refs) =>
        refs.map((ref) => ({
          ...ref,
          coins: ref.coins + 0.1 * multiplier,
        }))
      );
    }
  }, [isLoggedIn, referrals, currentEnergy, multiTapLevel]);
  const handleLike = (index) => {
    setUpdates(
      updates.map((update, i) => {
        if (i === index) {
          return {
            ...update,
            likes: update.liked ? update.likes - 1 : update.likes + 1,
            liked: !update.liked,
          };
        }
        return update;
      })
    );
  };
  const handleComment = (index) => {
    setUpdates(
      updates.map((update, i) => {
        if (i === index) {
          return {
            ...update,
            showComments: !update.showComments,
          };
        }
        return update;
      })
    );
  };
  const handleAddComment = (index) => {
    if (newComment.trim()) {
      setUpdates(
        updates.map((update, i) => {
          if (i === index) {
            return {
              ...update,
              comments: [
                ...update.comments,
                {
                  username: "You",
                  content: newComment,
                  time: "now",
                },
              ],
            };
          }
          return update;
        })
      );
      setNewComment("");
    }
  };
  const handleMultiTapUpgrade = () => {
    if (coins >= multiTapPrices[multiTapLevel]) {
      setCoins((prev) => prev - multiTapPrices[multiTapLevel]);
      setMultiTapLevel((prev) => prev + 1);
    }
  };
  const handleCapacityUpgrade = () => {
    if (coins >= capacityPrice) {
      setCoins((prev) => prev - capacityPrice);
      setCapacityLevel((prev) => prev + 1);
      setMaxEnergy((prev) => prev * 2);
      setCapacityPrice((prev) => prev * 2);
    }
  };
  const handleBuyRewardBot = () => {
    if (coins >= 100000) {
      setCoins((prev) => prev - 100000);
      setHasRewardBot(true);
      setRewardBotTimer(36000000);
      startRewardBotTimer();
    }
  };
  const handleClaimReward = () => {
    const reward = Math.floor(Math.random() * 9001) + 1000;
    setCoins((prev) => prev + reward);
    setRewardBotTimer(36000000);
    startRewardBotTimer();
  };
  const startRewardBotTimer = () => {
    const timer = setInterval(() => {
      setRewardBotTimer((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setSignupError(
        "Please use a valid email domain (gmail.com, yahoo.com, hotmail.com, outlook.com)"
      );
      return;
    }
    setIsLoggedIn(true);
    setShowLogin(false);
  };
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!validateEmail(resetEmail)) {
      setSignupError(
        "Please use a valid email domain (gmail.com, yahoo.com, hotmail.com, outlook.com)"
      );
      return;
    }
    setShowResetForm(false);
    alert("Password reset link sent to your email");
  };
  const validateReferralCode = (code) => {
    return code === "WELCOME2024";
  };
  const checkUsernameEmail = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taken = Math.random() < 0.3;
        resolve(!taken);
      }, 500);
    });
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    if (!validateEmail(email)) {
      setSignupError(
        "Please use a valid email domain (gmail.com, yahoo.com, hotmail.com, outlook.com)"
      );
      return;
    }
    const isAvailable = await checkUsernameEmail();
    if (!isAvailable) {
      setSignupError("Username or email already taken");
      return;
    }
    if (referralCode && !validateReferralCode(referralCode)) {
      setSignupError("Invalid referral code");
      return;
    }
    setIsLoggedIn(true);
    setShowLogin(false);
    setCoins(referralCode && validateReferralCode(referralCode) ? 500 : 0);
  };
  const handleSpin = () => {
    if (spinning || (nextSpinTime && nextSpinTime > Date.now())) return;
    setSpinning(true);
    const sections = ["200", "500", "1000", "200", "500", "5000", "200", "500"];
    const randomSection = Math.floor(Math.random() * sections.length);
    const angle = randomSection * (360 / sections.length) + 1440;
    setSpinAngle(angle);
    setTimeout(() => {
      const reward = parseInt(sections[randomSection]);
      setSpinResult(reward);
      setShowSpinResult(true);
      setCoins((prev) => prev + reward);
      setSpinning(false);
      const tomorrow = new Date();
      tomorrow.setUTCHours(24, 0, 0, 0);
      setNextSpinTime(tomorrow.getTime());
    }, 3000);
  };
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
  };
  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Mine Coino",
        text: "Mine free Coinos with me!",
        url: referralLink,
      });
    }
  };
  const handleTaskClick = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed && !task.verifying) {
      window.open(task.url, "_blank");
      setTasks(
        tasks.map((t) => {
          if (t.id === taskId) {
            return { ...t, verifying: true };
          }
          return t;
        })
      );
      const timer = setInterval(() => {
        setTasks((prevTasks) => {
          return prevTasks.map((t) => {
            if (t.id === taskId) {
              const newTimeLeft = t.timeLeft - 1;
              if (newTimeLeft <= 0) {
                clearInterval(timer);
                return { ...t, verifying: false, timeLeft: 30 };
              }
              return { ...t, timeLeft: newTimeLeft };
            }
            return t;
          });
        });
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId ? { ...t, completed: true, verifying: false } : t
          )
        );
        setCoins((prev) => prev + task.reward);
      }, 30000);
    }
  };
  const bgColor = darkMode ? "bg-[#1a1a1a]" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-[#1a1a1a]";
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [referralCode, setReferralCode] = useState("");

  if (showLogin) {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} font-poppins p-4`}>
        {!showResetForm ? (
          !showSignup ? (
            <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4">
              <h1 className="text-3xl font-bold text-center text-[#ffd700]">
                Mine Coino
              </h1>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 rounded bg-[#2a2a2a] text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded bg-[#2a2a2a] text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full p-2 bg-[#ffd700] rounded text-black"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setShowSignup(true)}
                className="w-full p-2 bg-[#ffd700] rounded text-black"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setShowResetForm(true)}
                className="w-full p-2 bg-transparent border border-[#ffd700] rounded"
              >
                Reset Password
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSignup}
              className="max-w-md mx-auto space-y-4"
            >
              <h1 className="text-3xl font-bold text-center text-[#ffd700]">
                Sign Up
              </h1>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 rounded bg-[#2a2a2a] text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 rounded bg-[#2a2a2a] text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded bg-[#2a2a2a] text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Referral Code (Optional)"
                className="w-full p-2 rounded bg-[#2a2a2a] text-white"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
              {signupError && (
                <div className="text-red-500 text-sm">{signupError}</div>
              )}
              <button
                type="submit"
                className="w-full p-2 bg-[#ffd700] rounded text-black"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setShowSignup(false)}
                className="w-full p-2 bg-transparent border border-[#ffd700] rounded"
              >
                Back to Login
              </button>
            </form>
          )
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="max-w-md mx-auto space-y-4"
          >
            <h1 className="text-3xl font-bold text-center text-[#ffd700]">
              Reset Password
            </h1>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded bg-[#2a2a2a] text-white"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-[#ffd700] rounded text-black"
            >
              Send Reset Link
            </button>
            <button
              type="button"
              onClick={() => setShowResetForm(false)}
              className="w-full p-2 bg-transparent border border-[#ffd700] rounded"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} font-poppins`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#ffd700]">Mine Coino</h1>
          <div className="flex items-center gap-4">
            <a href="/announcements" className="p-2">
              <i className="fas fa-users"></i>
            </a>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2">
              <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setShowLogin(true);
              }}
              className="p-2"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>

        {activeTab === "home" && (
          <div className="flex flex-col items-center">
            <div className="stats bg-[#2a2a2a] rounded-lg p-4 w-full max-w-md mb-8">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <div className="text-lg">Your Coinos: {coins.toFixed(2)}</div>
                  <div className="text-lg">Taps: {taps}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg">
                    Energy: {currentEnergy}/{maxEnergy}
                  </div>
                  {energyResetTime && currentEnergy === 0 && (
                    <div className="text-sm text-[#ffd700]">
                      Resets in: {formatTime(energyResetTime - Date.now())}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowBoostModal(true)}
                  className="w-full p-2 bg-[#ffd700] text-black rounded mt-2"
                >
                  <i className="fas fa-bolt mr-2"></i>
                  Boost
                </button>
              </div>
            </div>

            <button
              onClick={handleCoinClick}
              disabled={currentEnergy <= 0}
              className="transform active:scale-95 transition-transform"
            >
              <div
                className={`w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-full ${
                  currentEnergy > 0 ? "bg-[#ffd700]" : "bg-gray-500"
                } flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow`}
              >
                <i className="fas fa-coins text-6xl md:text-7xl text-[#1a1a1a]"></i>
              </div>
            </button>

            {showBoostModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-[#2a2a2a] p-6 rounded-lg w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#ffd700]">Boosts</h3>
                    <button onClick={() => setShowBoostModal(false)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#1a1a1a] p-4 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-bold">
                            Multi-Tap Level {multiTapLevel}
                          </h4>
                          <p className="text-sm text-gray-400">
                            Multiply your taps
                          </p>
                        </div>
                        <button
                          onClick={handleMultiTapUpgrade}
                          disabled={coins < multiTapPrices[multiTapLevel]}
                          className="px-4 py-2 bg-[#ffd700] text-black rounded disabled:opacity-50"
                        >
                          {multiTapPrices[multiTapLevel]} coins
                        </button>
                      </div>
                    </div>
                    <div className="bg-[#1a1a1a] p-4 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-bold">
                            Capacity Level {capacityLevel}
                          </h4>
                          <p className="text-sm text-gray-400">
                            Double your energy capacity
                          </p>
                        </div>
                        <button
                          onClick={handleCapacityUpgrade}
                          disabled={coins < capacityPrice}
                          className="px-4 py-2 bg-[#ffd700] text-black rounded disabled:opacity-50"
                        >
                          {capacityPrice} coins
                        </button>
                      </div>
                    </div>
                    <div className="bg-[#1a1a1a] p-4 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-bold">Reward Bot</h4>
                          <p className="text-sm text-gray-400">
                            Random rewards every 10h
                          </p>
                        </div>
                        {!hasRewardBot ? (
                          <button
                            onClick={handleBuyRewardBot}
                            disabled={coins < 100000}
                            className="px-4 py-2 bg-[#ffd700] text-black rounded disabled:opacity-50"
                          >
                            100,000 coins
                          </button>
                        ) : rewardBotTimer > 0 ? (
                          <div className="text-sm text-[#ffd700]">
                            {formatTime(rewardBotTimer)}
                          </div>
                        ) : (
                          <button
                            onClick={handleClaimReward}
                            className="px-4 py-2 bg-[#ffd700] text-black rounded"
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "invite" && (
          <div className="space-y-4">
            <div className="bg-[#2a2a2a] p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Your Referral Code</h2>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value="WELCOME2024"
                  readOnly
                  className="w-full p-2 rounded bg-[#1a1a1a]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("WELCOME2024");
                      setNotificationMessage("Referral code copied!");
                      setShowNotification(true);
                      setTimeout(() => setShowNotification(false), 2000);
                    }}
                    className="flex-1 p-2 bg-[#ffd700] text-black rounded"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    Copy Code
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Join Mine Coino",
                          text: "Use my referral code: WELCOME2024",
                        });
                      }
                    }}
                    className="flex-1 p-2 bg-[#ffd700] text-black rounded"
                  >
                    <i className="fas fa-share-alt mr-2"></i>
                    Share Code
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#2a2a2a] p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Your Referral Link</h2>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="w-full p-2 rounded bg-[#1a1a1a]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referralLink);
                      setNotificationMessage("Referral link copied!");
                      setShowNotification(true);
                      setTimeout(() => setShowNotification(false), 2000);
                    }}
                    className="flex-1 p-2 bg-[#ffd700] text-black rounded"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    Copy Link
                  </button>
                  <button
                    onClick={shareReferralLink}
                    className="flex-1 p-2 bg-[#ffd700] text-black rounded"
                  >
                    <i className="fas fa-share-alt mr-2"></i>
                    Share Link
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#2a2a2a] p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Your Referrals</h2>
              <div className="space-y-2">
                {referrals.map((ref, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{ref.username}</span>
                    <span>{ref.coins} Coinos</span>
                  </div>
                ))}
              </div>
            </div>
            {showNotification && (
              <div className="fixed top-4 right-4 bg-[#2a2a2a] text-white px-4 py-2 rounded shadow-lg notification">
                {notificationMessage}
              </div>
            )}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="bg-[#2a2a2a] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Top Miners</h2>
            <div className="space-y-2">
              {leaderboard.map((user, i) => (
                <div
                  key={i}
                  className="flex justify-between p-2 bg-[#1a1a1a] rounded"
                >
                  <span>
                    #{i + 1} {user.username}
                  </span>
                  <span>{user.coins} Coinos</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#2a2a2a] p-4 rounded-lg flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-sm text-[#ffd700]">
                    Reward: {task.reward} Coinos
                  </p>
                  {task.verifying && (
                    <p className="text-sm text-yellow-500">
                      Verifying... {task.timeLeft}s
                    </p>
                  )}
                  {task.timeLeft === 0 && !task.completed && (
                    <p className="text-sm text-red-500">
                      Time expired! Click GO to try again
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleTaskClick(task.id)}
                  className={`px-4 py-2 rounded ${
                    task.completed
                      ? "bg-green-500"
                      : task.verifying
                      ? "bg-yellow-500"
                      : "bg-[#ffd700] text-black"
                  }`}
                  disabled={task.completed || task.verifying}
                >
                  {task.completed
                    ? "Completed"
                    : task.verifying
                    ? task.timeLeft + "s"
                    : "GO"}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "spin" && (
          <div className="flex flex-col items-center">
            <div className="w-[300px] h-[300px] relative mb-4">
              <div
                className="w-full h-full rounded-full border-8 border-[#FFD700] relative overflow-hidden shadow-lg"
                style={{
                  transform: `rotate(${spinAngle}deg)`,
                  transition: spinning
                    ? "transform 3s cubic-bezier(0.4, 2, 0.2, 1)"
                    : "",
                  background: "linear-gradient(45deg, #FFD700, #FDB931)",
                }}
              >
                {["200", "500", "1000", "200", "500", "5000", "200", "500"].map(
                  (value, i) => (
                    <div
                      key={i}
                      className="absolute w-1/2 h-1/2 origin-bottom-right"
                      style={{
                        transform: `rotate(${i * 45}deg)`,
                        transformOrigin: "0% 100%",
                      }}
                    >
                      <div
                        className={`w-full h-full flex items-center justify-center`}
                        style={{
                          background: i % 2 === 0 ? "#4169E1" : "#FFD700",
                          boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
                        }}
                      >
                        <span
                          className="font-bold transform -rotate-45 text-white drop-shadow-lg"
                          style={{ marginLeft: "30%" }}
                        >
                          {value}
                        </span>
                      </div>
                    </div>
                  )
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #FFD700, #FDB931)",
                      boxShadow:
                        "0 4px 6px rgba(0,0,0,0.1), inset 0 -2px 5px rgba(0,0,0,0.2)",
                    }}
                  >
                    <i className="fas fa-sync-alt text-2xl text-black"></i>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-1/2 -ml-6 w-12 h-12">
                <div
                  className="w-12 h-12"
                  style={{
                    background: "linear-gradient(145deg, #FFD700, #FDB931)",
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                ></div>
              </div>
            </div>
            <button
              onClick={handleSpin}
              disabled={spinning || (nextSpinTime && nextSpinTime > Date.now())}
              className="px-6 py-3 rounded-full font-bold text-black"
              style={{
                background: "linear-gradient(145deg, #FFD700, #FDB931)",
                boxShadow:
                  "0 4px 6px rgba(0,0,0,0.1), inset 0 -2px 5px rgba(0,0,0,0.2)",
              }}
            >
              {spinning
                ? "Spinning..."
                : nextSpinTime > Date.now()
                ? formatTime(nextSpinTime - Date.now())
                : "SPIN!"}
            </button>
            {showSpinResult && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-[#2a2a2a] p-6 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-[#ffd700] mb-4">
                    You won {spinResult} coins!
                  </h3>
                  <button
                    onClick={() => setShowSpinResult(false)}
                    className="px-4 py-2 bg-[#ffd700] text-black rounded"
                  >
                    Awesome!
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-[#2a2a2a] p-4">
          <div className="flex justify-around max-w-md mx-auto">
            {["home", "invite", "leaderboard", "tasks", "spin"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-2 ${activeTab === tab ? "text-[#ffd700]" : ""}`}
              >
                <i
                  className={`fas fa-${
                    tab === "home"
                      ? "home"
                      : tab === "invite"
                      ? "user-plus"
                      : tab === "leaderboard"
                      ? "trophy"
                      : tab === "tasks"
                      ? "tasks"
                      : "sync"
                  }`}
                ></i>
                <div className="text-xs capitalize">{tab}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        .notification {
          animation: fadeOut 2s forwards;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;