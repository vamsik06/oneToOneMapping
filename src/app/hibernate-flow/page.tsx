"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../card";
import { Button } from "../../../button";
import { cn } from "../../../utils";

// Define the Student interface for type safety
interface Student {
  id?: number;
  name: string;
  marks: number;
  gender: string;
  email: string;
  phone: string;
}

// The Java code snippet for Student (KodnestStudent)
const studentJavaCode = `package com.kodnest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "kodneststudent")
public class KodnestStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String email;
    private String phone;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    // Getters and Setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public Address getAddress() {
        return address;
    }
    public void setAddress(Address address) {
        this.address = address;
    }
}`;

// The Java code snippet for Address
const addressJavaCode = `package com.kodnest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String street;
    private String city;
    private String state;
    private String zipcode;

    // Getters and Setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getStreet() {
        return street;
    }
    public void setStreet(String street) {
        this.street = street;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public String getZipcode() {
        return zipcode;
    }
    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }
}`;

export default function HibernateFlow() {
  const [step, setStep] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showLines, setShowLines] = useState(false);
  const [showData, setShowData] = useState(false);
  const [dataColumns, setDataColumns] = useState([false, false, false, false, false, false]);

  // Refs for positioning
  const codeBoxRef = useRef<HTMLDivElement>(null);
  const javaAppRightRef = useRef<HTMLDivElement>(null);
  const hibernateRef = useRef<HTMLDivElement>(null);
  const jpaRef = useRef<HTMLDivElement>(null);
  const databaseTableRef = useRef<HTMLTableElement>(null);

  // Initial student data
  const initialStudent: Student = {
    id: 1,
    name: "Ravi Kumar",
    marks: 85.5,
    gender: "Male",
    email: "ravi.kumar@gmail.com",
    phone: "9876543210",
  };

  // New state for right card animation
  const [showStudentObj, setShowStudentObj] = useState(false);
  const [showAddressObj, setShowAddressObj] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  // Refs for arrow positioning
  const addressIdRef = useRef<HTMLSpanElement>(null);
  const addressObjRef = useRef<HTMLDivElement>(null);
  const [arrowPos, setArrowPos] = useState<{start: {x: number, y: number}, end: {x: number, y: number}} | null>(null);

  // Address data
  const addressData = {
    id: 1,
    street: "123 Kodnest Lane",
    city: "Bengaluru",
    state: "Karnataka",
    zipcode: "560037",
  };

  // Handle Start button
  const handleStart = () => {
    setStep(1);
    setShowStudentObj(false);
    setShowAddressObj(false);
    setShowArrow(false);
    setTimeout(() => setShowStudentObj(true), 100); // slight delay for smoothness
    setTimeout(() => setShowAddressObj(true), 1100);
    setTimeout(() => setShowArrow(true), 1400);
  };

  // Animation step timings (ms)
  const STEP_DELAYS = [2000, 2000, 2000, 2000, 1000];

  useEffect(() => {
    if (step === 0 || step >= 6) return;
    const timeout = setTimeout(() => setStep(step + 1), STEP_DELAYS[step - 1]);
    return () => clearTimeout(timeout);
  }, [step]);

  // Handle data column animation
  useEffect(() => {
    if (step === 6) {
      const columnDelays = [500, 1000, 1500, 2000, 2500, 3000];
      columnDelays.forEach((delay, index) => {
        setTimeout(() => {
          setDataColumns(prev => {
            const newColumns = [...prev];
            newColumns[index] = true;
            return newColumns;
          });
        }, delay);
      });
    }
  }, [step]);

  // Calculate arrow position after both objects are visible
  useEffect(() => {
    function updateArrow() {
      if (showStudentObj && showAddressObj) {
        const startEl = addressIdRef.current;
        const endEl = addressObjRef.current;
        if (startEl && endEl) {
          const startRect = startEl.getBoundingClientRect();
          const endRect = endEl.getBoundingClientRect();
          let end = {
            x: endRect.left - 16,
            y: endRect.top + endRect.height / 2,
          };
          const start = {
            x: startRect.right - startRect.width / 4,
            y: startRect.top + startRect.height / 2,
          };
          setArrowPos({ start, end });
        }
      } else {
        setArrowPos(null);
      }
    }
    updateArrow();
    window.addEventListener('resize', updateArrow);
    window.addEventListener('scroll', updateArrow, true);
    return () => {
      window.removeEventListener('resize', updateArrow);
      window.removeEventListener('scroll', updateArrow, true);
    };
  }, [showStudentObj, showAddressObj]);

  // State for hibernate highlight
  const [hibernateHighlight, setHibernateHighlight] = useState(false);
  const hibernateBoxRef = useRef<HTMLDivElement>(null);
  const [moveObjectsDown, setMoveObjectsDown] = useState(false);

  // After arrow is placed, highlight hibernate.cfg.xml for 1 second
  useEffect(() => {
    if (arrowPos && showStudentObj && showAddressObj) {
      // Wait 1 second before highlighting
      const highlightTimer = setTimeout(() => {
        setHibernateHighlight(true);
        // Highlight for 2 seconds, then move objects down
        const removeHighlightTimer = setTimeout(() => {
          setHibernateHighlight(false);
          setMoveObjectsDown(true);
        }, 2000);
        // Cleanup for highlight removal
        return () => clearTimeout(removeHighlightTimer);
      }, 1000);
      // Cleanup for initial delay
      return () => clearTimeout(highlightTimer);
    }
  }, [arrowPos, showStudentObj, showAddressObj]);

  // Reset function
  const resetFlow = () => {
    setStep(0);
    setShowLines(false);
    setShowData(false);
    setDataColumns([false, false, false, false, false, false]);
    setShowStudentObj(false);
    setShowAddressObj(false);
    setShowArrow(false);
    setHibernateHighlight(false);
    setMoveObjectsDown(false);
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Auto-scroll code box
  useEffect(() => {
    const codeBox = codeBoxRef.current;
    if (!codeBox) return;
    let scrollInterval: NodeJS.Timeout | null = null;
    const scrollSpeed = 1;
    const scrollDelay = 50;
    scrollInterval = setInterval(() => {
      if (codeBox.scrollHeight - codeBox.scrollTop === codeBox.clientHeight) {
        codeBox.scrollTop = 0;
      } else {
        codeBox.scrollTop += scrollSpeed;
      }
    }, scrollDelay);
    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, []);

  return (
    <div className={cn("min-h-screen p-8 flex flex-col items-center relative overflow-hidden transition-colors", darkMode ? "bg-gray-900" : "bg-gray-50")}>
      <div className="w-full max-w-6xl border-2 border-black dark:border-gray-700 rounded-xl p-4 mb-8 bg-white dark:bg-gray-800">
        {/* Heading Row with Buttons and Dark/Light Toggle */}
        <div className="w-full flex items-center justify-between mb-4">
          {/* Left: Start and Reset Buttons */}
          <div className="flex items-center gap-2">
            <Button onClick={handleStart} className="px-4 py-2 text-sm">Start</Button>
            <Button onClick={resetFlow} className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600">Reset</Button>
          </div>
          {/* Center: Java App Heading */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center flex-1">Java App</h1>
          {/* Right: Dark/Light Toggle */}
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="ml-2 p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                <path stroke="currentColor" strokeWidth="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
        </div>

        {/* Remove the original Student Object Bubble Animation section */}

      {/* Main content layout */}
      <div className="w-full max-w-6xl flex flex-col gap-4 relative z-0">
        {/* Code Blocks Section: Left block with both codes side by side, right block empty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto">
          {/* Left: Combined Code Block */}
          <Card className="relative border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-0 flex flex-col">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row min-h-0 items-stretch">
                {/* Student.java */}
                <div className="flex-1 flex flex-col min-w-0 border-b md:border-b-0 md:border-r border-gray-700">
                  <div className="bg-gray-800 text-yellow-300 text-xs font-semibold px-3 py-2 border-b border-gray-700">Student.java</div>
                  <div className="overflow-auto bg-gray-900 text-white text-xs font-mono p-3 max-h-40">
                    <pre className="whitespace-pre-wrap">{studentJavaCode}</pre>
                  </div>
                </div>
                {/* Address.java */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="bg-gray-800 text-yellow-300 text-xs font-semibold px-3 py-2 border-b border-gray-700">Address.java</div>
                  <div className="overflow-auto bg-gray-900 text-white text-xs font-mono p-3 max-h-40">
                    <pre className="whitespace-pre-wrap">{addressJavaCode}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
            {/* Tiny hibernate.cfg.xml box at bottom left, overlapping border */}
            <div
              ref={hibernateBoxRef}
              className={
                `absolute -bottom-15 left-0 z-10 border bg-white rounded w-[100px] h-[38px] flex flex-col items-center justify-center text-[10px] shadow transition-all duration-300 ` +
                (hibernateHighlight ? 'border-2 border-yellow-400 bg-yellow-100 shadow-lg' : 'border-black')
              }
            >
              <span className="font-bold text-[10px] text-gray-800 leading-none">hibernate.cfg.xml</span>
              <span className="text-[15px] text-gray-700 leading-none">&lt;/&gt;</span>
            </div>
          </Card>
          {/* Right: Empty Code Block */}
          <Card className="relative border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-0 flex flex-col h-60 overflow-visible">
            <CardContent className="flex-1 flex items-center justify-center text-gray-400 text-sm relative">
              {/* Animated objects and arrow */}
              <div className="w-full h-full relative flex items-center justify-center">
                {/* Student Object */}
                <AnimatePresence>
                  {showStudentObj && (
                    <motion.div
                      key="student-obj"
                      initial={{ opacity: 0, scale: 0.7, y: 0 }}
                      animate={{ opacity: 1, scale: moveObjectsDown ? 0.7 : 1, x: 0, y: moveObjectsDown ? 250 : 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.4 }}
                      className="absolute left-2.7 -translate-x-40 -translate-y-10 top-6 w-44 h-44 rounded-full bg-white border-2 border-black flex flex-col items-start justify-center text-xs p-4 text-left shadow z-10 text-gray-900"
                    >
                      <span className="font-bold text-xs mb-1">Student Object</span>
                      <span className="text-xs">Name: <span className="font-medium">Ravi Kumar</span></span>
                      <span className="text-xs truncate">Email: <span className="font-medium">ravi.kumar@gmail.com</span></span>
                      <span className="text-xs">Phone: <span className="font-medium">9876543210</span></span>
                      <span className="text-xs">address_id: <span ref={addressIdRef} className="font-medium">1</span></span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Address Object */}
                <AnimatePresence>
                  {showAddressObj && (
                    <motion.div
                      key="address-obj"
                      initial={{ opacity: 0, scale: 0.7, y:20 }}
                      animate={{ opacity: 1, scale: moveObjectsDown ? 0.7 : 1, x: 0, y: moveObjectsDown ? 250 : 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.4 }}
                      className="absolute right-4 -translate-x-15 -translate-y-30 top-40 w-44 h-44 rounded-full bg-orange-200 border-2 border-black flex flex-col items-start justify-center text-xs p-4 text-left shadow-lg z-10 text-gray-900"
                      ref={addressObjRef}
                    >
                      <span className="font-bold text-xs mb-1">Address Object</span>
                      <span className="text-xs">id: <span className="font-medium">1</span></span>
                      <span className="text-xs">Street: <span className="font-medium">123 Kodnest Lane</span></span>
                      <span className="text-xs">setCity: <span className="font-medium">Bengaluru</span></span>
                      <span className="text-xs">State: <span className="font-medium">Karnataka</span></span>
                      <span className="text-xs">Zipcode: <span className="font-medium">560037</span></span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Arrow from address_id to Address Object */}
                {arrowPos && (
                  <svg
                    className="pointer-events-none fixed top-0 left-0 z-50"
                    style={{ width: '100vw', height: '100vh', pointerEvents: 'none' }}
                  >
                    <defs>
                      <marker id="arrowhead2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L8,4 L0,8 L2, Z" fill="#f59e42" />
                      </marker>
                    </defs>
                    <motion.line
                      x1={arrowPos.start.x}
                      y1={moveObjectsDown ? arrowPos.start.y + 250 : arrowPos.start.y}
                      x2={arrowPos.end.x}
                      y2={moveObjectsDown ? arrowPos.end.y + 250 : arrowPos.end.y}
                      stroke="#f59e42"
                      strokeWidth="3"
                      markerEnd="url(#arrowhead2)"
                      animate={{
                        y1: moveObjectsDown ? arrowPos.start.y + 250 : arrowPos.start.y,
                        y2: moveObjectsDown ? arrowPos.end.y + 250 : arrowPos.end.y,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </svg>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Hibernate Section */}
          <div className="flex justify-center w-full mt-4">
            <div ref={hibernateRef} className={cn(
              "relative w-full max-w-4xl min-h-[220px] flex items-center justify-center border-2 bg-white dark:bg-gray-800 p-8",
              step === 3 && "border-blue-400 shadow-[0_0_12px_4px_rgba(51,153,255,0.3)]",
              "border-black dark:border-gray-700"
            )}>
              {/* Hibernate Label */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-4 font-bold text-2xl text-gray-800 dark:text-gray-100">Hibernate</div>
              {/* JPA Box with highlight animation */}
              <div ref={jpaRef} className={cn(
                "absolute left-1/2 bottom-10 -translate-x-1/2 translate-y-1/2 border-2 bg-white dark:bg-gray-800 w-48 h-16 flex items-center justify-center",
                step === 4 && "border-yellow-400 shadow-[0_0_12px_4px_rgba(255,221,51,0.5)] animate-pulse",
                "border-black dark:border-gray-700"
              )}>
                <span className="font-bold text-xl text-gray-800 dark:text-gray-100">JPA</span>
        </div>
              {/* Animate vertical lines to database */}
              {step === 5 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 120, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute left-1/2 bottom-0 w-1 bg-yellow-400"
                  style={{ height: 120 }}
                />
              )}
            </div>
        </div>

          {/* Database Tables Side by Side */}
          <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
            {/* Student Table */}
            <div className="flex-1">
              <Card className="border-2 border-black dark:border-gray-700 relative p-4 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-center text-xl text-gray-800 dark:text-gray-100">Student Table</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-800 dark:text-gray-100">
                    <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 border-r">ID</th>
                        <th className="px-4 py-2 border-r">NAME</th>
                        <th className="px-4 py-2 border-r">EMAIL</th>
                        <th className="px-4 py-2 border-r">PHONE</th>
                        <th className="px-4 py-2">ADDRESS_ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2">{initialStudent.id}</td>
                        <td className="px-4 py-2">{initialStudent.name}</td>
                        <td className="px-4 py-2">{initialStudent.email}</td>
                        <td className="px-4 py-2">{initialStudent.phone}</td>
                        <td className="px-4 py-2">1</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
            {/* Address Table */}
            <div className="flex-1">
              <Card className="border-2 border-black dark:border-gray-700 relative p-4 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-center text-xl text-gray-800 dark:text-gray-100">Address Table</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-800 dark:text-gray-100">
                    <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 border-r">ID</th>
                        <th className="px-4 py-2 border-r">STREET</th>
                        <th className="px-4 py-2 border-r">CITY</th>
                        <th className="px-4 py-2 border-r">STATE</th>
                        <th className="px-4 py-2">ZIPCODE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2">1</td>
                        <td className="px-4 py-2">123 Kodnest Lane</td>
                        <td className="px-4 py-2">Bengaluru</td>
                        <td className="px-4 py-2">Karnataka</td>
                        <td className="px-4 py-2">560037</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>
      </div>
      </div>
    </div>
  );
}
