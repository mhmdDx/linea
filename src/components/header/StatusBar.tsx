import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StatusBar = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set the date we're counting down to (10 days from now)
    // For a static 10 days reset every reload (as per simple request), logic is simpler.
    // Ideally, this should be a fixed future date.
    // Let's set a fixed date 10 days from now for persistence during session, or just a hardcoded target.
    // For this implementation, I will simulate a 10-day countdown that ticks down.

    // Target date: 10 days from execution
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white py-2.5 px-4 text-xs font-medium tracking-wide">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">

        {/* Left Message */}
        <span>
          FREE shipping on orders over 1000 EGP - Don't miss the deals!
        </span>

        {/* Center/Right Timer & Action */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-sm font-bold">
            <span>{String(timeLeft.days).padStart(2, '0')}D</span> :
            <span>{String(timeLeft.hours).padStart(2, '0')}H</span> :
            <span>{String(timeLeft.minutes).padStart(2, '0')}M</span> :
            <span>{String(timeLeft.seconds).padStart(2, '0')}S</span>
          </div>

          <Link to="/category/shop" className="underline hover:no-underline font-semibold">
            Explore
          </Link>
        </div>

      </div>
    </div>
  );
};

export default StatusBar;