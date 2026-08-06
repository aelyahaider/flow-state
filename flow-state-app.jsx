import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Home, Calendar, Moon, Heart, CheckSquare, DollarSign } from 'lucide-react';

const FlowState = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  // Period state
  const [periodData, setPeriodData] = useState(() => {
    const saved = localStorage.getItem('periodData');
    return saved ? JSON.parse(saved) : {
      cycles: [],
      symptoms: {}
    };
  });

  // Sleep state
  const [sleepData, setSleepData] = useState(() => {
    const saved = localStorage.getItem('sleepData');
    return saved ? JSON.parse(saved) : {};
  });

  // Calendar state
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });

  // Prayer state
  const [prayers, setPrayers] = useState(() => {
    const saved = localStorage.getItem('prayers');
    return saved ? JSON.parse(saved) : {};
  });

  // Chores state
  const [chores, setChores] = useState(() => {
    const saved = localStorage.getItem('chores');
    return saved ? JSON.parse(saved) : [];
  });

  // Budget state
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  // Load name
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) setName(savedName);
  }, []);

  // Save name
  const handleNameSave = (newName) => {
    setName(newName);
    localStorage.setItem('userName', newName);
    setShowNameInput(false);
  };

  // Period tracking
  const logPeriod = (date) => {
    const newCycle = {
      startDate: date,
      symptoms: {}
    };
    const updated = [...periodData.cycles, newCycle];
    setPeriodData({ ...periodData, cycles: updated });
    localStorage.setItem('periodData', JSON.stringify({ ...periodData, cycles: updated }));
  };

  const addSymptom = (date, symptom, intensity) => {
    const dateStr = date.toISOString().split('T')[0];
    const updated = {
      ...periodData.symptoms,
      [dateStr]: {
        ...periodData.symptoms[dateStr],
        [symptom]: intensity
      }
    };
    setPeriodData({ ...periodData, symptoms: updated });
    localStorage.setItem('periodData', JSON.stringify({ ...periodData, symptoms: updated }));
  };

  const getPeriodInfo = () => {
    if (periodData.cycles.length === 0) return null;
    const lastCycle = new Date(periodData.cycles[periodData.cycles.length - 1].startDate);
    const today = new Date();
    const daysSince = Math.floor((today - lastCycle) / (1000 * 60 * 60 * 24));
    return { lastCycle, daysSince, cycleDay: daysSince + 1 };
  };

  const getPeriodPhase = () => {
    const info = getPeriodInfo();
    if (!info) return 'unknown';
    const day = info.cycleDay;
    if (day <= 5) return 'menstruation';
    if (day <= 11) return 'follicular';
    if (day <= 16) return 'ovulation';
    return 'luteal';
  };

  const getPhaseEmoji = () => {
    const phase = getPeriodPhase();
    const emojis = {
      menstruation: '🩸',
      follicular: '🌱',
      ovulation: '🌸',
      luteal: '🌙'
    };
    return emojis[phase] || '🌙';
  };

  // Sleep tracking
  const logSleep = (date, bedtime, waketime) => {
    const dateStr = date.toISOString().split('T')[0];
    const bed = new Date(`2000-01-01 ${bedtime}`);
    const wake = new Date(`2000-01-02 ${waketime}`);
    const hours = (wake - bed) / (1000 * 60 * 60);
    
    const updated = {
      ...sleepData,
      [dateStr]: { bedtime, waketime, hours: parseFloat(hours.toFixed(1)) }
    };
    setSleepData(updated);
    localStorage.setItem('sleepData', JSON.stringify(updated));
  };

  const getWeekSleep = () => {
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      week.push(sleepData[dateStr]?.hours || 0);
    }
    return week;
  };

  // Calendar events
  const addEvent = (date, title, category) => {
    const newEvent = {
      id: Date.now(),
      date: date.toISOString().split('T')[0],
      title,
      category
    };
    setEvents([...events, newEvent]);
    localStorage.setItem('events', JSON.stringify([...events, newEvent]));
  };

  const getTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.date === today);
  };

  // Prayers
  const logPrayer = (date, prayer) => {
    const dateStr = date.toISOString().split('T')[0];
    const updated = {
      ...prayers,
      [dateStr]: {
        ...prayers[dateStr],
        [prayer]: true
      }
    };
    setPrayers(updated);
    localStorage.setItem('prayers', JSON.stringify(updated));
  };

  const getPrayerCount = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayPrayers = prayers[today] || {};
    return Object.values(todayPrayers).filter(v => v).length;
  };

  // Chores
  const addChore = (title, frequency) => {
    const newChore = {
      id: Date.now(),
      title,
      frequency,
      completed: false
    };
    setChores([...chores, newChore]);
    localStorage.setItem('chores', JSON.stringify([...chores, newChore]));
  };

  const toggleChore = (id) => {
    const updated = chores.map(c => c.id === id ? { ...c, completed: !c.completed } : c);
    setChores(updated);
    localStorage.setItem('chores', JSON.stringify(updated));
  };

  // Budget
  const addExpense = (category, amount, date) => {
    const newExpense = {
      id: Date.now(),
      category,
      amount,
      date: date.toISOString().split('T')[0]
    };
    setExpenses([...expenses, newExpense]);
    localStorage.setItem('expenses', JSON.stringify([...expenses, newExpense]));
  };

  const getMonthlyExpenses = () => {
    const today = new Date();
    const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
    return expenses.filter(e => e.date.startsWith(currentMonth));
  };

  const getMonthlyByCategory = () => {
    const monthly = getMonthlyExpenses();
    const byCategory = {};
    monthly.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    return byCategory;
  };

  const getTotalMonthly = () => {
    return getMonthlyExpenses().reduce((sum, e) => sum + e.amount, 0);
  };

  // Render tabs
  const renderHome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif text-purple-900">Hello, {name || '[name]'}</h1>
          <p className="text-purple-600 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="text-center">
          <div className="inline-block text-6xl mb-4">{getPhaseEmoji()}</div>
          {getPeriodInfo() ? (
            <>
              <h2 className="text-3xl font-serif text-purple-900">Day {getPeriodInfo().cycleDay}</h2>
              <p className="text-purple-600 capitalize">{getPeriodPhase().replace(/([A-Z])/g, ' $1')}</p>
            </>
          ) : (
            <p className="text-purple-600">Log your first period</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-100 rounded-2xl p-4">
          <p className="text-purple-900 text-sm font-semibold">Sleep</p>
          <p className="text-2xl font-serif text-purple-900">{sleepData[new Date().toISOString().split('T')[0]]?.hours || '—'} hrs</p>
        </div>
        <div className="bg-purple-100 rounded-2xl p-4">
          <p className="text-purple-900 text-sm font-semibold">Prayers</p>
          <p className="text-2xl font-serif text-purple-900">{getPrayerCount()}/5</p>
        </div>
        <div className="bg-purple-100 rounded-2xl p-4">
          <p className="text-purple-900 text-sm font-semibold">Spending</p>
          <p className="text-2xl font-serif text-purple-900">${getTotalMonthly()}</p>
        </div>
        <div className="bg-purple-100 rounded-2xl p-4">
          <p className="text-purple-900 text-sm font-semibold">Events</p>
          <p className="text-2xl font-serif text-purple-900">{getTodayEvents().length}</p>
        </div>
      </div>

      {getTodayEvents().length > 0 && (
        <div>
          <h3 className="text-lg font-serif text-purple-900 mb-3">Today's Events</h3>
          <div className="space-y-2">
            {getTodayEvents().map(event => (
              <div key={event.id} className="bg-purple-100 rounded-2xl p-3 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full`} style={{
                  backgroundColor: {
                    'Classes': '#8B7BB9',
                    'Friends': '#E8B4F1',
                    'ECAs': '#C4A8E0',
                    'Sports': '#A78BCD',
                    'Personal': '#D4BEE8',
                    'Family': '#F1D9FF'
                  }[event.category] || '#8B7BB9'
                }}></div>
                <span className="text-purple-900 font-medium">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPeriod = () => (
    <div className="space-y-6">
      <div className="text-center bg-white rounded-3xl p-8">
        <div className="inline-block text-7xl mb-4">{getPhaseEmoji()}</div>
        {getPeriodInfo() ? (
          <>
            <h2 className="text-4xl font-serif text-purple-900">Day {getPeriodInfo().cycleDay}</h2>
            <p className="text-purple-600 capitalize mt-2">{getPeriodPhase().replace(/([A-Z])/g, ' $1')}</p>
            {getPeriodInfo().cycleDay <= 5 && <p className="text-red-600 text-sm mt-2">Menstruation</p>}
          </>
        ) : (
          <p className="text-purple-600">No cycles logged yet</p>
        )}
      </div>

      {getPeriodInfo() && (
        <>
          <button
            onClick={() => logPeriod(new Date())}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full py-3 font-serif text-lg transition"
          >
            Log Period
          </button>

          <div className="space-y-3">
            <h3 className="font-serif text-purple-900 text-lg">Symptoms</h3>
            {['Cramps', 'Bloating', 'Mood Swings', 'Headache', 'Fatigue', 'Nausea'].map(symptom => (
              <button
                key={symptom}
                onClick={() => addSymptom(new Date(), symptom, 'mild')}
                className="w-full bg-purple-100 hover:bg-purple-200 rounded-2xl p-4 text-left font-serif text-purple-900 transition flex justify-between items-center"
              >
                {symptom}
                <span className="text-yellow-500">●</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderCalendar = () => {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [eventTitle, setEventTitle] = useState('');
    const [eventCategory, setEventCategory] = useState('Classes');

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-4">
          <div className="text-center mb-4">
            <h2 className="font-serif text-purple-900 text-lg">{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
              <div key={day} className="text-center text-purple-600 text-sm font-semibold">{day}</div>
            ))}
            {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`}></div>
            ))}
            {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1))}
                className={`p-2 rounded-lg text-sm font-serif transition ${
                  i + 1 === selectedDate.getDate() ? 'bg-purple-700 text-white' : 'text-purple-900 hover:bg-purple-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Event title"
            className="w-full rounded-2xl p-3 border-2 border-purple-200 focus:border-purple-500 outline-none font-serif"
          />
          <select
            value={eventCategory}
            onChange={(e) => setEventCategory(e.target.value)}
            className="w-full rounded-2xl p-3 border-2 border-purple-200 focus:border-purple-500 outline-none font-serif"
          >
            {['Classes', 'Friends', 'ECAs', 'Sports', 'Personal', 'Family'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => {
              if (eventTitle) {
                addEvent(selectedDate, eventTitle, eventCategory);
                setEventTitle('');
              }
            }}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full py-3 font-serif transition"
          >
            Add Event
          </button>
        </div>

        {events.filter(e => e.date === selectedDate.toISOString().split('T')[0]).length > 0 && (
          <div>
            <h3 className="font-serif text-purple-900 mb-3">Events on this day</h3>
            <div className="space-y-2">
              {events.filter(e => e.date === selectedDate.toISOString().split('T')[0]).map(event => (
                <div key={event.id} className="bg-purple-100 rounded-2xl p-3">
                  <p className="text-purple-900 font-medium">{event.title}</p>
                  <p className="text-purple-600 text-sm">{event.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSleep = () => {
    const [bedtime, setBedtime] = useState('22:00');
    const [waketime, setWaketime] = useState('07:00');
    const weekData = getWeekSleep();

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block">
            <span className="text-purple-900 font-serif mb-2 block">Bedtime</span>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full rounded-2xl p-3 border-2 border-purple-200 focus:border-purple-500 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-purple-900 font-serif mb-2 block">Wake time</span>
            <input
              type="time"
              value={waketime}
              onChange={(e) => setWaketime(e.target.value)}
              className="w-full rounded-2xl p-3 border-2 border-purple-200 focus:border-purple-500 outline-none"
            />
          </label>
          <button
            onClick={() => logSleep(new Date(), bedtime, waketime)}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full py-3 font-serif transition"
          >
            Log Sleep
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-serif text-purple-900 mb-4">This Week</h3>
          <div className="flex items-end gap-2 h-32 justify-center">
            {weekData.map((hours, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-6 bg-purple-400 rounded-t-lg transition"
                  style={{ height: `${Math.max(hours * 10, 4)}px` }}
                ></div>
                <span className="text-purple-600 text-xs font-semibold">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-purple-600 text-sm mt-4">Average: {(weekData.reduce((a, b) => a + b, 0) / 7).toFixed(1)} hrs</p>
        </div>
      </div>
    );
  };

  const renderPrayers = () => {
    const prayerList = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const today = new Date().toISOString().split('T')[0];
    const todayPrayers = prayers[today] || {};
    const periodInfo = getPeriodInfo();
    const isDuringPeriod = periodInfo && periodInfo.cycleDay <= 5;

    return (
      <div className="space-y-6">
        {isDuringPeriod && (
          <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4 text-center">
            <p className="text-red-900 font-serif">No prayers to log during menstruation</p>
          </div>
        )}

        <div className="space-y-3">
          {!isDuringPeriod && prayerList.map(prayer => (
            <button
              key={prayer}
              onClick={() => logPrayer(new Date(), prayer)}
              className={`w-full rounded-2xl p-4 font-serif text-lg transition ${
                todayPrayers[prayer]
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
              }`}
            >
              {prayer} {todayPrayers[prayer] && '✓'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-purple-600 text-sm">This month</p>
          <p className="text-3xl font-serif text-purple-900">{Object.values(prayers).reduce((count, day) => count + Object.values(day).filter(v => v).length, 0)}</p>
          <p className="text-purple-600 text-sm">Prayers logged</p>
        </div>
      </div>
    );
  };

  const renderChores = () => {
    const [choreTitle, setChoreTitle] = useState('');
    const [choreFreq, setChoreFreq] = useState('Weekly');

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <input
            type="text"
            value={choreTitle}
            onChange={(e) => setChoreTitle(e.target.value)}
            placeholder="Chore name"
            className="w-full rounded-2xl p-3 border-2 border-purple-200 focus:border-purple-500 outline-none font-serif"
          />
          <select
            value={choreFreq}
            onChange={(e) => setChoreFreq(e.target.value)}
            className="w-full rounded-2xl p-3 border-2 border-purple-200 focus:border-purple-500 outline-none font-serif"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Bi-weekly</option>
          </select>
          <button
            onClick={() => {
              if (choreTitle) {
                addChore(choreTitle, choreFreq);
                setChoreTitle('');
              }
            }}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full py-3 font-serif transition"
          >
            Add Chore
          </button>
        </div>

        {chores.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-serif text-purple-900">Your Chores</h3>
            {chores.map(chore => (
              <button
                key={chore.id}
                onClick={() => toggleChore(chore.id)}
                className={`w-full rounded-2xl p-4 font-serif text-left transition flex justify-between items-center ${
                  chore.completed
                    ? 'bg-purple-200 text-purple-900 line-through'
                    : 'bg-purple-100 text-purple-900 hover:bg-purple-150'
                }`}
              >
                <span>{chore.title}</span>
                <span className="text-xs text-purple-600">{chore.frequency}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBudget = () => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const byCategory = getMonthlyByCategory();

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full rounded-2xl p-3 border-2 border-purple-200 focus:border-purple-500 outline-none font-serif"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl p-3 border-2 border-purple-200 focus:border-purple-500 outline-none font-serif"
          >
            {['Food', 'Utilities', 'Grocery', 'Miscellaneous'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => {
              if (amount) {
                addExpense(category, parseFloat(amount), new Date());
                setAmount('');
              }
            }}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full py-3 font-serif transition"
          >
            Add Expense
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-purple-600 text-sm">Total this month</p>
          <p className="text-4xl font-serif text-purple-900">${getTotalMonthly()}</p>
        </div>

        {Object.keys(byCategory).length > 0 && (
          <div>
            <h3 className="font-serif text-purple-900 mb-3">By Category</h3>
            <div className="space-y-2">
              {Object.entries(byCategory).map(([cat, amount]) => (
                <div key={cat} className="bg-purple-100 rounded-2xl p-3 flex justify-between items-center">
                  <span className="text-purple-900 font-medium">{cat}</span>
                  <span className="text-purple-900 font-serif">${amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const quickActionItems = [
    { label: 'Log Period', action: () => { logPeriod(new Date()); setShowQuickActions(false); } },
    { label: 'Log Sleep', action: () => { setActiveTab('sleep'); setShowQuickActions(false); } },
    { label: 'Add Event', action: () => { setActiveTab('calendar'); setShowQuickActions(false); } },
    { label: 'Log Prayer', action: () => { setActiveTab('prayers'); setShowQuickActions(false); } },
    { label: 'Add Expense', action: () => { setActiveTab('budget'); setShowQuickActions(false); } },
    { label: 'Add Chore', action: () => { setActiveTab('chores'); setShowQuickActions(false); } }
  ];

  return (
    <div className="min-h-screen bg-amber-50" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="max-w-md mx-auto pb-24 pt-4 px-4">
        {/* Header with name and quick actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            {showNameInput ? (
              <input
                type="text"
                autoFocus
                defaultValue={name}
                onBlur={(e) => handleNameSave(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSave(e.target.value)}
                className="text-2xl font-serif text-purple-900 bg-transparent border-b-2 border-purple-900 outline-none"
              />
            ) : (
              <button
                onClick={() => setShowNameInput(true)}
                className="text-2xl font-serif text-purple-900 hover:text-purple-700"
              >
                {name ? name : 'Set your name'}
              </button>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="bg-purple-700 hover:bg-purple-800 text-white rounded-full p-3 transition"
            >
              <Plus size={24} />
            </button>
            {showQuickActions && (
              <div className="absolute top-16 right-0 bg-white rounded-2xl shadow-lg p-3 w-48 z-50">
                <div className="grid grid-cols-2 gap-2">
                  {quickActionItems.map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg p-3 text-sm font-serif transition"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab content */}
        <div className="min-h-96">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'period' && renderPeriod()}
          {activeTab === 'calendar' && renderCalendar()}
          {activeTab === 'sleep' && renderSleep()}
          {activeTab === 'prayers' && renderPrayers()}
          {activeTab === 'chores' && renderChores()}
          {activeTab === 'budget' && renderBudget()}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-200">
        <div className="max-w-md mx-auto flex justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'period', icon: Heart, label: 'Period' },
            { id: 'calendar', icon: Calendar, label: 'Calendar' },
            { id: 'sleep', icon: Moon, label: 'Sleep' },
            { id: 'prayers', icon: Heart, label: 'Prayers' },
            { id: 'budget', icon: DollarSign, label: 'Budget' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 flex flex-col items-center gap-1 transition ${
                activeTab === tab.id ? 'text-purple-700 bg-purple-50' : 'text-purple-400 hover:text-purple-600'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowState;
