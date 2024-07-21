'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { MenuIcon, XIcon, DollarSign, PieChart, Target, Brain, Briefcase, Star, Calendar, TrendingUp, BarChart2, Shield, UserPlus, Wallet, ArrowRight } from 'lucide-react';
import Desktop from '@/assets/heroPage/hero-desktop.png';
import Dashboard from '@/assets/heroPage/dashboard.png';

const HeroPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();

  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const jobsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
  }, [controls]);
  

  const scrollToSection = (elementRef: any) => {
    window.scrollTo({
      top: elementRef.current.offsetTop - 80,
      behavior: 'smooth'
    });
  };

  const smoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      window.scrollTo({
        behavior: 'smooth',
        top: element.offsetTop - 80, 
      });
    }
  };
  useEffect(() => {

    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((link:any) => {
      link.addEventListener('click', (e:any) => {
        e.preventDefault();
        const id = link.getAttribute('href').slice(1);
        smoothScroll(id);
      });
    });

    // Clean up event listeners
    return () => {
      navLinks.forEach((link:any) => {
        link.removeEventListener('click', (e:any) => {
          e.preventDefault();
          const id = link.getAttribute('href').slice(1);
          smoothScroll(id);
        });
      });
    };
  }, []);

  const NavLink = ({ href, children }:any) => (
    <a 
      href={href} 
      className="text-base font-medium text-gray-500 hover:text-gray-900"
      onClick={(e) => {
        e.preventDefault();
        smoothScroll(href.slice(1));
      }}
    >
      {children}
    </a>
  );

  const Feature = ({ icon: Icon, title, description }: any) => (
    <div className="relative">
      <dt>
        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
          <Icon className="h-6 w-6" />
        </div>
        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{title}</p>
      </dt>
      <dd className="mt-2 ml-16 text-base text-gray-500">{description}</dd>
    </div>
  );


  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a href="#" className="text-blue-600 text-xl font-bold">Mint</a>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <button
                type="button"
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <nav className="hidden md:flex space-x-10">
              <NavLink href="#features" onClick={() => scrollToSection(featuresRef)}>Features</NavLink>
              <NavLink href="#how-it-works" onClick={() => scrollToSection(howItWorksRef)}>How it works</NavLink>
              <NavLink href="#jobs" onClick={() => scrollToSection(jobsRef)}>Jobs</NavLink>
              <NavLink href="#testimonials" onClick={() => scrollToSection(testimonialsRef)}>Testimonials</NavLink>
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Link href="/login" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <motion.div
          className={`absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isMenuOpen ? 1 : 0, scale: isMenuOpen ? 1 : 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div className="text-blue-600 text-xl font-bold">Mint</div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <NavLink href="#features" onClick={() => { scrollToSection(featuresRef); setIsMenuOpen(false); }}>Features</NavLink>
                  <NavLink href="#how-it-works" onClick={() => { scrollToSection(howItWorksRef); setIsMenuOpen(false); }}>How it works</NavLink>
                  <NavLink href="#jobs" onClick={() => { scrollToSection(jobsRef); setIsMenuOpen(false); }}>Jobs</NavLink>
                  <NavLink href="#testimonials" onClick={() => { scrollToSection(testimonialsRef); setIsMenuOpen(false); }}>Testimonials</NavLink>
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <Link href="/login" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden pt-20 md:pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block xl:inline">Your Personal</span>{' '}
                  <span className="block text-blue-600 xl:inline">Financial Advisor</span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Mint helps you understand your spending, manage your budget, and achieve your financial goals. Get started today and take control of your financial future.
                </motion.p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 z-10 mt-20 lg:w-1/2">
          <Image
            className="h-full w-full object-contain sm:h-72 md:h-full lg:w-full lg:h-full"
            src={Desktop}
            alt="Financial planning illustration"
            layout="responsive"
            objectFit="contain"
            quality={100}
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        id="features"
        className="py-12 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Financial Management
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Mint provides powerful tools to help you track expenses, create budgets, and plan for the future.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <Feature
                icon={DollarSign}
                title="Expense Tracking"
                description="Automatically categorize and track your daily expenses."
              />
              <Feature
                icon={PieChart}
                title="Budget Planning"
                description="Create and manage monthly and weekly budgets by category."
              />
              <Feature
                icon={Target}
                title="Savings Goals"
                description="Set and track savings goals with visual progress indicators."
              />
              <Feature
                icon={Brain}
                title="AI Financial Assistant"
                description="Get personalized financial advice and insights through natural language queries."
              />
              <Feature
                icon={Calendar}
                title="Transaction Calendar"
                description="View and manage your transactions with an intuitive calendar interface."
              />
              <Feature
                icon={TrendingUp}
                title="Income Analytics"
                description="Analyze your monthly income and track your financial growth."
              />
              <Feature
                icon={BarChart2}
                title="Spending Insights"
                description="Visualize your spending patterns with interactive graphs and charts."
              />
              <Feature
                icon={Shield}
                title="Secure Data"
                description="Your financial data is protected with bank-level security measures."
              />
            </dl>
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={howItWorksRef}
        id="how-it-works"
        className="py-16 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple steps to financial clarity
            </p>
          </div>

          <div className="mt-16">
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {[
                {
                  icon: UserPlus,
                  title: "Sign Up and Connect Your Accounts",
                  description: "Create your Mint account and securely link your bank accounts, credit cards, and other financial institutions."
                },
                {
                  icon: Target,
                  title: "Set Your Financial Goals",
                  description: "Define your short-term and long-term financial goals, such as saving for a vacation or paying off debt."
                },
                {
                  icon: PieChart,
                  title: "Track and Analyze Your Spending",
                  description: "Mint automatically categorizes your transactions, allowing you to see where your money is going and identify areas for improvement."
                },
                {
                  icon: Wallet,
                  title: "Create and Manage Budgets",
                  description: "Set up custom budgets for different spending categories and track your progress throughout the month."
                },
                {
                  icon: Brain,
                  title: "Get Personalized Advice",
                  description: "Receive tailored financial insights and recommendations from our AI-powered assistant to help you make better financial decisions."
                }
              ].map((step, index) => (
                <li key={index} className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <step.icon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {step.title}
                    {index === 4 && (
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-3">
                        Latest
                      </span>
                    )}
                  </h3>
                  <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 text-center">
            <Link href="/signup" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Get Started Now
            </Link>
          </div>
        </div>
      </motion.section>


      {/* Dashboard Preview Section */}
      <motion.section
        className="py-12 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <section className="py-16 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Dashboard</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                Your financial overview at a glance
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Get a clear picture of your finances with our intuitive and comprehensive dashboard.
              </p>
            </div>

            <div className="mt-16 relative">
              <div className="relative">
                <Image
                  className="w-full rounded-xl shadow-2xl"
                  src={Dashboard}
                  alt="Dashboard Preview"
                  width={2880}
                  height={1620}
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              </div>
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <h3 className="text-2xl font-bold text-white">Ready to take control of your finances?</h3>
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Get started now
                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.section>

      <motion.section
        ref={jobsRef}
        id="jobs"
        className="py-12 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Job Opportunities</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Find your next career move
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Explore job listings tailored to your skills and financial goals.
            </p>
          </div>

          <div className="mt-10 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
            {[
              {
                title: "Financial Analyst",
                company: "TechCorp Inc.",
                location: "New York, NY",
                salary: "$80,000 - $120,000",
                description: "Join our team as a Financial Analyst and help drive strategic financial decisions."
              },
              {
                title: "Senior Accountant",
                company: "Global Finance Ltd.",
                location: "Chicago, IL",
                salary: "$70,000 - $100,000",
                description: "We're seeking an experienced Senior Accountant to manage complex financial operations."
              },
              {
                title: "Investment Advisor",
                company: "Wealth Managers Group",
                location: "San Francisco, CA",
                salary: "$90,000 - $150,000",
                description: "Help clients achieve their financial goals as an Investment Advisor in our growing firm."
              }
            ].map((job, index) => (
              <div key={index} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600">
                      {job.company}
                    </p>
                    <a href="#" className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">{job.title}</p>
                      <p className="mt-3 text-base text-gray-500">{job.description}</p>
                    </a>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{job.company}</span>
                      <Briefcase className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {job.location}
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      < motion.section
        ref={testimonialsRef}
        id="testimonials"
        className="py-12 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What our users are saying
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "John Doe",
                role: "Entrepreneur",
                content: "Mint has transformed the way I manage my finances. It's intuitive, powerful, and has helped me grow my business by making smarter financial decisions.",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                name: "Jane Smith",
                role: "Freelancer",
                content: "The AI assistant is like having a personal financial advisor. It provides tailored advice that has helped me optimize my spending and increase my savings. Highly recommended!",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                name: "Mike Johnson",
                role: "Student",
                content: "As a student, Mint helps me stay on top of my budget and save for the future. The goal-setting feature has been a game-changer in managing my finances responsibly.",
                avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-12 w-12 rounded-full" src={testimonial.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-500">
                    "{testimonial.content}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>


      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Mint</h3>
              <p className="text-gray-400">Your personal financial advisor</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="#jobs" className="text-gray-400 hover:text-white">Jobs</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Mint. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HeroPage;