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
   // New state for right card animation
  const [showStudentObj, setShowStudentObj] = useState(false);
  const [showAddressObj, setShowAddressObj] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  // Refs for arrow positioning
  const addressIdRef = useRef<HTMLSpanElement>(null);
  const addressObjRef = useRef<HTMLDivElement>(null);
  const [arrowPos, setArrowPos] = useState<{start: {x: number, y: number}, end: {x: number, y: number}} | null>(null);
  // Refs for JPA and table headers
  const jpaBoxRef = useRef<HTMLDivElement>(null);
  const studentHeaderRefs = useRef<(HTMLTableHeaderCellElement | null)[]>([...Array(5)].map(() => null));
  const addressHeaderRefs = useRef<(HTMLTableHeaderCellElement | null)[]>([...Array(5)].map(() => null));
  const [jpaToHeaders, setJpaToHeaders] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  // State for hibernate highlight
  const [hibernateHighlight, setHibernateHighlight] = useState(false);
  const hibernateBoxRef = useRef<HTMLDivElement>(null);
  const [moveObjectsDown, setMoveObjectsDown] = useState(false);
  // New: control visibility after move down
  const [objectsVisible, setObjectsVisible] = useState(true);
  // New: control fade-out after move down
  const [fadeObjects, setFadeObjects] = useState(false);

  // Initial student data
  const initialStudent: Student = {
    
    name: "Ravi Kumar",
    marks: 85.5,
    gender: "Male",
    email: "ravi.kumar@gmail.com",
    phone: "9876543210",
  };

 

  // Address data
  const addressData = {
    id: 1,
    street: "123 Kodnest...",
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
          const end = {
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

  // New: Hide objects 1s after they move down
  useEffect(() => {
    if (moveObjectsDown) {
      // Start fade after 1s
      const fadeTimer = setTimeout(() => setFadeObjects(true), 1000);
      // Remove from DOM after fade (0.5s)
      const hideTimer = setTimeout(() => {
        setObjectsVisible(false);
      }, 1500);
      // Advance to JPA highlight only after objects are gone
      const jpaTimer = setTimeout(() => {
        setStep(4);
      }, 1550);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
        clearTimeout(jpaTimer);
      };
    } else {
      setObjectsVisible(true); // Reset if flow is reset
      setFadeObjects(false);
    }
  }, [moveObjectsDown]);

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
    setObjectsVisible(true); // Reset visibility
    setFadeObjects(false); // Reset fade
  };


  // Calculate lines from JPA to each column header when JPA is highlighted
  useEffect(() => {
    if (step === 4 && jpaBoxRef.current) {
      const jpaRect = jpaBoxRef.current.getBoundingClientRect();
      const jpaCenter = {
        x: jpaRect.left + jpaRect.width / 2,
        y: jpaRect.top + jpaRect.height / 2,
      };
      const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
      studentHeaderRefs.current.forEach((ref) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          lines.push({
            x1: jpaCenter.x,
            y1: jpaCenter.y,
            x2: rect.left + rect.width / 2,
            y2: rect.top + rect.height / 2,
          });
        }
      });
      addressHeaderRefs.current.forEach((ref) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          lines.push({
            x1: jpaCenter.x,
            y1: jpaCenter.y,
            x2: rect.left + rect.width / 2,
            y2: rect.top + rect.height / 2,
          });
        }
      });
      setJpaToHeaders(lines);
    } else {
      setJpaToHeaders([]);
    }
  }, [step]);

  // Track if flow is running
  const [flowRunning, setFlowRunning] = useState(false);

  // Update flowRunning when Start or Reset is clicked
  const handleStartClick = () => {
    setFlowRunning(true);
    handleStart();
  };
  const handleResetClick = () => {
    setFlowRunning(false);
    resetFlow();
  };

  return (
    <div className={cn("min-h-screen p-8 flex flex-col items-center relative overflow-hidden transition-colors")}> 
      {/* Main constraint wrapper */}
      <div className="relative w-full max-w-[800px] max-h-[800px] h-full overflow-auto flex flex-col items-center justify-center border-2 border-black dark:border-gray-700 rounded-xl p-4 mb-8 bg-gray-50 dark:bg-gray-900">
        {/* Heading Row with Buttons and Dark/Light Toggle */}
        <div className="w-full flex items-center justify-between mb-4">
          {/* Left: Start and Reset Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleStartClick}
              className={`px-5 py-2 text-sm font-semibold rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${flowRunning ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400'}`}
              disabled={flowRunning}
            >
              Start
            </Button>
            <Button
              onClick={handleResetClick}
              className={`px-5 py-2 text-sm font-semibold rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${flowRunning ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-300'}`}
            >
              Reset
            </Button>
          </div>
          {/* Center: Java App Heading */}
          <h1 className={cn("text-3xl font-bold text-gray-800 dark:text-gray-100 text-center flex-1", darkMode ? "text-white" : "")}>Java App</h1>
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
      <div className="w-full h-full flex flex-col gap-4 relative z-0">
        {/* Code Blocks Section: Left block with both codes side by side, right block empty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[220px] max-h-[220px]">
          {/* Left: Combined Code Block */}
          <Card className="relative border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-0 flex flex-col h-full max-h-full">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row min-h-0 items-stretch">
                {/* Student.java */}
                <div className="flex-1 flex flex-col min-w-0 border-b md:border-b-0 md:border-r border-gray-700">
                  <div className="bg-gray-800 text-yellow-300 text-xs font-semibold px-3 py-2 border-b border-gray-700">Student.java</div>
                  <div className="overflow-auto bg-gray-900 text-white text-xs font-mono p-3 max-h-43">
                    <pre className="whitespace-pre-wrap">{studentJavaCode}</pre>
                  </div>
                </div>
                {/* Address.java */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="bg-gray-800 text-yellow-300 text-xs font-semibold px-3 py-2 border-b border-gray-700">Address.java</div>
                  <div className="overflow-auto bg-gray-900 text-white text-xs font-mono p-3 max-h-43">
                    <pre className="whitespace-pre-wrap">{addressJavaCode}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
            {/* Tiny hibernate.cfg.xml box at bottom left, overlapping border */}
            <div
              ref={hibernateBoxRef}
              className={
                `absolute -bottom-6 left-0 z-10 border bg-white dark:bg-gray-800 rounded w-[85px] h-[26px] flex flex-col items-center justify-center text-[7px] shadow transition-all duration-300 ` +
                (hibernateHighlight ? 'border-2 border-yellow-400 bg-yellow-100 dark:bg-yellow-900 shadow-lg' : 'border-black dark:border-gray-700')
              }
            >
              <span className="font-bold text-[10px] text-gray-800 dark:text-gray-100 leading-none">hibernate.cfg.xml</span>

            </div>
          </Card>
          {/* Right: Empty Code Block */}
          <Card className="relative border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-0 flex flex-col h-full max-h-full">
            <CardContent className="flex-1 flex items-center justify-center text-gray-400 text-sm relative h-full max-h-full">
              {/* Animated objects and arrow */}
              <div className="w-full h-full relative flex items-center justify-center">
                {/* Student Object */}
                <AnimatePresence>
                  {showStudentObj && objectsVisible && (
                    <motion.div
                      key="student-obj"
                      initial={{ opacity: 0, scale: 0.7, y: 0 }}
                      animate={{
                        opacity: fadeObjects ? 0 : 1,
                        scale: moveObjectsDown ? 0.7 : 1,
                        x: 0,
                        y: moveObjectsDown ? 240 : 0
                      }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.4, opacity: { duration: 0.5 } }}
                      className="absolute left-2.9 -translate-x-20 -translate-y-7 top-6 w-33 h-33 rounded-full bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 flex flex-col items-start justify-center text-xs p-4 text-left shadow z-10 text-gray-900 dark:text-gray-100"
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
                  {showAddressObj && objectsVisible && (
                    <motion.div
                      key="address-obj"
                      initial={{ opacity: 0, scale: 0.7, y:20 }}
                      animate={{
                        opacity: fadeObjects ? 0 : 1,
                        scale: moveObjectsDown ? 0.7 : 1,
                        x: 0,
                        y: moveObjectsDown ? 220 : 0
                      }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.4, opacity: { duration: 0.5 } }}
                      className="absolute right-4 -translate-x-2 -translate-y-30 top-40 w-37 h-37 rounded-full bg-orange-200 dark:bg-orange-900 border-2 border-black dark:border-gray-700 flex flex-col items-start justify-center text-xs p-4 text-left shadow-lg z-10 text-gray-900 dark:text-gray-100"
                      ref={addressObjRef}
                    >
                      <span className="font-bold text-xs mb-1">Address Object</span>
                      <span className="text-xs">id: <span className="font-medium">1</span></span>
                      <span className="text-xs">Street: <span className="font-medium">123 Kodnest...</span></span>
                      <span className="text-xs">setCity: <span className="font-medium">Bengaluru</span></span>
                      <span className="text-xs">State: <span className="font-medium">Karnataka</span></span>
                      <span className="text-xs">Zipcode: <span className="font-medium">560037</span></span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Arrow from address_id to Address Object */}
                {arrowPos && objectsVisible && (
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
                      y1={moveObjectsDown ? arrowPos.start.y + 220 : arrowPos.start.y}
                      x2={arrowPos.end.x}
                      y2={moveObjectsDown ? arrowPos.end.y + 220 : arrowPos.end.y}
                      stroke="#f59e42"
                      strokeWidth="3"
                      markerEnd="url(#arrowhead2)"
                      animate={{
                        opacity: fadeObjects ? 0 : 1,
                        y1: moveObjectsDown ? arrowPos.start.y + 220 : arrowPos.start.y,
                        y2: moveObjectsDown ? arrowPos.end.y + 220 : arrowPos.end.y,
                      }}
                      transition={{ duration: 0.4, opacity: { duration: 0.5 } }}
                    />
                  </svg>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Hibernate Section */}
          <div className="flex justify-center w-full mt-2 max-h-[250px]">
            <div ref={hibernateRef} className={cn(
              "relative w-full max-w-4xl min-h-[150px] flex items-center justify-center border-2 bg-white dark:bg-gray-800 p-4",
              step === 3 && "border-blue-400 shadow-[0_0_12px_4px_rgba(51,153,255,0.3)]",
              "border-black dark:border-gray-700"
            )}>
              {/* Hibernate Label */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 font-bold text-2xl text-gray-800 dark:text-gray-100">Hibernate</div>
              {/* JPA Box with highlight animation */}
              <div
                ref={el => {
                  jpaRef.current = el;
                  jpaBoxRef.current = el;
                }}
                className={cn(
                "absolute left-1/2 bottom-10 -translate-x-1/2 translate-y-9 border-2 bg-white dark:bg-gray-800 w-23 h-5 flex items-center justify-center",
                step === 4 && "border-yellow-400 shadow-[0_0_12px_4px_rgba(255,221,51,0.5)] animate-pulse",
                "border-black dark:border-gray-700"
                )}
              >
                <span className="font-bold text-base text-gray-800 dark:text-gray-100">JPA</span>
        </div>
              </div>
            </div>

          {/* Database Tables Side by Side */}
          <div className="flex flex-col md:flex-row gap-4 w-full mt-2 relative max-h-[180px]">
            {/* JPA to Table Header Lines */}
            {step === 4 && jpaToHeaders.length > 0 && (
              <svg className="pointer-events-none fixed top-0 left-0 z-50" style={{ width: '100vw', height: '100vh', pointerEvents: 'none' }}>
                {jpaToHeaders.map((line, idx) => (
                  <line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#facc15"
                    strokeWidth="3"
                    style={{ opacity: 0.85 }}
                  />
                ))}
              </svg>
            )}
            {/* Student Table */}
            <div className="flex-1">
              <Card className="border-2 border-black dark:border-gray-700 relative  bg-white dark:bg-gray-800 ">
                <CardHeader>
                  <CardTitle className="text-center text-base text-gray-800 dark:text-gray-100">Student Table</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-gray-800 dark:text-gray-100">
                    <thead className="text-[10px] text-gray-700 dark:text-gray-200 uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {/* <th ref={studentHeaderRefs[0]} className="px-2 py-1 border-r">ID</th> */}
                        <th ref={el => { studentHeaderRefs.current[1] = el; }} className="px-2 py-1 border-r">NAME</th>
                        <th ref={el => { studentHeaderRefs.current[2] = el; }} className="px-2 py-1 border-r">EMAIL</th>
                        <th ref={el => { studentHeaderRefs.current[3] = el; }} className="px-2 py-1 border-r">PHONE</th>
                        <th ref={el => { studentHeaderRefs.current[4] = el; }} className="px-2 py-1">ADDRESS_ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {step >= 5 ? (
                        <tr>
                          {/* <td className="px-2 py-1">{initialStudent.id}</td> */}
                          <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{initialStudent.name}</td>
                          <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{initialStudent.email}</td>
                          <td className="px-2 py-1 text-gray-800 dark:text-gray-100">{initialStudent.phone}</td>
                          <td className="px-2 py-1">1</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
            {/* Address Table */}
            <div className="flex-1">
              <Card className="border-2 border-black dark:border-gray-700 relative p-1 bg-white dark:bg-gray-800 h-full max-h-full">
          <CardHeader>
                  <CardTitle className="text-center text-base text-gray-800 dark:text-gray-100">Address Table</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-gray-800 dark:text-gray-100">
                <thead className="text-[10px] text-gray-700 dark:text-gray-200 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                        <th ref={el => { addressHeaderRefs.current[0] = el; }} className="px-2 py-1 border-r">ID</th>
                        <th ref={el => { addressHeaderRefs.current[1] = el; }} className="px-2 py-1 border-r">STREET</th>
                        <th ref={el => { addressHeaderRefs.current[2] = el; }} className="px-2 py-1 border-r">CITY</th>
                        <th ref={el => { addressHeaderRefs.current[3] = el; }} className="px-2 py-1 border-r">STATE</th>
                        <th ref={el => { addressHeaderRefs.current[4] = el; }} className="px-2 py-1">ZIPCODE</th>
                </tr>
              </thead>
              <tbody>
                      {step >= 5 ? (
                        <tr>
                          <td className="px-2 py-1">1</td>
                          <td className="px-2 py-1">123 Kodnest...</td>
                          <td className="px-2 py-1">Bengaluru</td>
                          <td className="px-2 py-1">Karnataka</td>
                          <td className="px-2 py-1">560037</td>
                    </tr>
                      ) : null}
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
