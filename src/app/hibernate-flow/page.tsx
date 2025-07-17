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

// The Java code snippet
const javaCode = `package com.kodnest.main;

import com.kodnest.entity.Student;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

public class Application {
    public static void main(String[] args) {
        // Load Configuration and Build SessionFactory
        SessionFactory sessionFactory = new Configuration().configure().buildSessionFactory();

        // Open Session
        Session session = sessionFactory.openSession();

        // Begin Transaction
        Transaction transaction = session.beginTransaction();

        // Create and Persist Student
        Student student = new Student();
        student.setName("Ravi Kumar");
        student.setMarks(85.5);
        student.setGender("Male");
        student.setEmail("ravi.kumar@gmail.com");
        student.setPhone("9876543210");
        session.persist(student);

        // Commit Transaction
        transaction.commit();

        // Confirmation
        System.out.println("Student saved successfully!");

        // Close Session and SessionFactory
        session.close();
        sessionFactory.close();
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

  // Reset function
  const resetFlow = () => {
    setStep(0);
    setShowLines(false);
    setShowData(false);
    setDataColumns([false, false, false, false, false, false]);
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
            <Button onClick={() => setStep(1)} className="px-4 py-2 text-sm">Start</Button>
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

        {/* Student Object Bubble Animation */}
        <AnimatePresence>
          {step >= 1 && step <= 4 && (
            <motion.div
              key="student-bubble-animated"
              initial={{ 
                opacity: 0, 
                scale: 0.5,
                x: (javaAppRightRef.current?.offsetLeft || 0) + ((javaAppRightRef.current?.offsetWidth || 0) / 2) - 24,
                y: (javaAppRightRef.current?.offsetTop || 0) + ((javaAppRightRef.current?.offsetHeight || 0) / 2) - 24
              }}
              animate={{
                x: step === 1 ? (javaAppRightRef.current?.offsetLeft || 0) + ((javaAppRightRef.current?.offsetWidth || 0) / 2) - 24 :
                   step === 3 ? (hibernateRef.current?.offsetLeft || 0) + ((hibernateRef.current?.offsetWidth || 0) / 2) - 24 : 
                   (javaAppRightRef.current?.offsetLeft || 0) + ((javaAppRightRef.current?.offsetWidth || 0) / 2) - 24,
                y: step === 1 ? (javaAppRightRef.current?.offsetTop || 0) + ((javaAppRightRef.current?.offsetHeight || 0) / 2) - 24 :
                   step === 3 ? (hibernateRef.current?.offsetTop || 0) + ((hibernateRef.current?.offsetHeight || 0) / 2) - 24 : 
                   (javaAppRightRef.current?.offsetTop || 0) + ((javaAppRightRef.current?.offsetHeight || 0) / 2) - 24,
                opacity: step === 1 ? 1 : (step === 4 ? 0 : 1),
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
              className="rounded-full bg-blue-100 border-2 border-blue-500 flex flex-col items-center justify-center text-sm p-2 text-center shadow-lg w-48 h-48"
            >
              <p className="font-bold">Student Object</p>
              <p>Name: {initialStudent.name}</p>
              <p>Marks: {initialStudent.marks}</p>
              <p>Gender: {initialStudent.gender}</p>
              <p>Email: {initialStudent.email}</p>
              <p>Phone: {initialStudent.phone}</p>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Main content layout */}
      <div className="w-full max-w-6xl flex flex-col gap-4 relative z-0">
        {/* Java App Section */}
          <Card className="border-2 border-black dark:border-gray-700 relative p-4 bg-white dark:bg-gray-800">
            {/* hibernate.cfg.xml box with highlight animation */}
            <div className={cn(
              "absolute left-4 border-2 bg-white dark:bg-gray-800 flex flex-col items-center justify-center z-10",
              step === 2 && "border-yellow-400 shadow-[0_0_12px_4px_rgba(255,221,51,0.5)] animate-pulse",
              "border-black dark:border-gray-700"
            )} style={{ bottom: -40, width: '80px', height: '32px' }}>
              <span className="text-[10px] font-bold text-gray-800 dark:text-gray-100">hibernate.cfg.xml</span>
              <div className="text-xs text-gray-600 dark:text-gray-300">{"</>"}</div>
            </div>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64 relative">
              {/* Vertical Divider in the center */}
              <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-gray-700 dark:bg-gray-300 z-10" />
              {/* Code Box */}
              <div ref={codeBoxRef} className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg overflow-auto bg-gray-900 text-white text-sm font-mono relative h-60">
                <h3 className="font-semibold mb-2 text-lg text-center text-gray-200 dark:text-gray-100">Code</h3>
                <pre className="whitespace-pre-wrap">{javaCode}</pre>
                </div>
              {/* Right side empty */}
              <div ref={javaAppRightRef} className="flex items-center justify-center relative"></div>
            </CardContent>
          </Card>

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

          {/* Database Table */}
          <Card className="border-2 border-black dark:border-gray-700 relative p-4 mt-4 bg-white dark:bg-gray-800">
          <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-800 dark:text-gray-100">Database Table</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
              <table ref={databaseTableRef} className="w-full text-sm text-left text-gray-800 dark:text-gray-100">
                <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3 border-r border-gray-300 dark:border-gray-600">ID</th>
                    <th scope="col" className="px-6 py-3 border-r border-gray-300 dark:border-gray-600">Name</th>
                    <th scope="col" className="px-6 py-3 border-r border-gray-300 dark:border-gray-600">Marks</th>
                    <th scope="col" className="px-6 py-3 border-r border-gray-300 dark:border-gray-600">Gender</th>
                    <th scope="col" className="px-6 py-3 border-r border-gray-300 dark:border-gray-600">Email</th>
                    <th scope="col" className="px-6 py-3">Phone</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                    {step === 6 ? (
                    <motion.tr
                        key="data-row"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"
                    >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          {dataColumns[0] ? initialStudent.id : ""}
                        </td>
                        <td className="px-6 py-4">
                          {dataColumns[1] ? initialStudent.name : ""}
                        </td>
                        <td className="px-6 py-4">
                          {dataColumns[2] ? initialStudent.marks : ""}
                        </td>
                        <td className="px-6 py-4">
                          {dataColumns[3] ? initialStudent.gender : ""}
                        </td>
                        <td className="px-6 py-4">
                          {dataColumns[4] ? initialStudent.email : ""}
                        </td>
                        <td className="px-6 py-4">
                          {dataColumns[5] ? initialStudent.phone : ""}
                      </td>
                    </motion.tr>
                  ) : (
                      <tr className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-400 dark:text-gray-500">No data saved yet.</td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
