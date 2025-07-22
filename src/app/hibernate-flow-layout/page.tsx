"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../card";

export default function HibernateLayout() {
  // Refs for positioning calculations
  const containerRef = useRef<HTMLDivElement>(null)
  const jpaRef = useRef<HTMLDivElement>(null)
  const hibernateRef = useRef<HTMLDivElement>(null) // Ref for Hibernate box to get its width
  const tableHeaderRefs = useRef<(HTMLTableCellElement | null)[]>([])
  const codeBoxRef = useRef<HTMLDivElement>(null) // Ref for the code box for auto-scrolling

  const [linePositions, setLinePositions] = useState<Array<{ left: number; top: number; height: number }>>([])
  const [hibernateWidth, setHibernateWidth] = useState<number | undefined>(undefined) // State for Hibernate box width

  // Java code snippet (can be replaced with actual code later)
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
}`

  useEffect(() => {
    const calculatePositions = () => {
      if (!containerRef.current || !hibernateRef.current) {
        setLinePositions([])
        setHibernateWidth(undefined)
        return
      }

      const containerRect = containerRef.current.getBoundingClientRect()
      const jpaRect = jpaRef.current?.getBoundingClientRect()

      // Update Hibernate width for the table
      setHibernateWidth(hibernateRef.current.offsetWidth)

      const newLines: Array<{ left: number; top: number; height: number }> = []

      if (jpaRect) {
        const jpaBottom = jpaRect.bottom - containerRect.top

        tableHeaderRefs.current.forEach((headerRef) => {
          if (headerRef) {
            const headerRect = headerRef.getBoundingClientRect()
            const headerTop = headerRect.top - containerRect.top
            const lineHeight = headerTop - jpaBottom

            if (lineHeight > 0) {
              newLines.push({
                left: headerRect.left + headerRect.width / 2 - containerRect.left,
                top: jpaBottom,
                height: lineHeight,
              })
            }
          }
        })
      }
      setLinePositions(newLines)
    }

    calculatePositions()
    window.addEventListener("resize", calculatePositions)

    // Auto-scrolling for code box
    let scrollInterval: NodeJS.Timeout | null = null
    if (codeBoxRef.current) {
      const codeBox = codeBoxRef.current
      const scrollSpeed = 1 // pixels per interval
      const scrollDelay = 50 // ms per interval

      scrollInterval = setInterval(() => {
        if (codeBox.scrollHeight - codeBox.scrollTop === codeBox.clientHeight) {
          // Reached end, scroll back to top
          codeBox.scrollTop = 0
        } else {
          codeBox.scrollTop += scrollSpeed
        }
      }, scrollDelay)
    }

    return () => {
      window.removeEventListener("resize", calculatePositions)
      if (scrollInterval) {
        clearInterval(scrollInterval)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-white p-8 flex flex-col items-center relative overflow-hidden">
      {/* Overall Content Wrapper - Fixed width for precise control */}
      <div className="w-[1000px] flex flex-col gap-4 relative">
        {/* Java App */}
        <Card className="border-4 border-black p-4 h-64 bg-white relative overflow-visible">
          {/* Center Vertical Divider */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-gray-700 z-10" />
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-black">Java App</CardTitle>
          </CardHeader>
          <CardContent className="flex h-full">
            {/* Code Box */}
            <div
              ref={codeBoxRef}
              className="border-4 border-black border-r-0 flex-1 flex flex-col overflow-auto bg-gray-900 text-white text-sm font-mono relative"
            >
              {/* Horizontal line added here */}
              <h3 className="font-semibold text-lg text-center text-gray-200 p-4 border-b-4 border-black">Code</h3>
              <pre className="whitespace-pre-wrap p-4">{javaCode}</pre>
            </div>
            {/* Right Empty Box */}
            <div className="border-4 border-black border-l-0 flex-1 flex items-center justify-center bg-white">
              {/* Empty: No Student Object Placeholder */}
            </div>
          </CardContent>
        </Card>

        {/* Middle Section: hibernate.cfg.xml and Hibernate */}
        <div className="flex justify-between items-start relative -mt-12">
          {/* hibernate.cfg.xml (Simple div, not Card, for exact match, adjusted size) */}
          <div className="border-4 border-black p-4 h-24 w-[180px] flex-shrink-0 flex items-center justify-center bg-white text-xl font-bold text-black">
            hibernate.cfg.xml
          </div>

          {/* Hibernate Box */}
          <Card ref={hibernateRef} className="border-4 border-black p-4 flex-1 min-h-[100px] ml-8 bg-white">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold bottom - text-black">Hibernate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-end h-full pb-4">
              {/* JPA Box inside Hibernate */}
              <div ref={jpaRef} className="border-1 border-black w-2 h-5 flex items-center justify-center bg-white">
                <div className="text-xl font-bold text-black">JPA</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Database Table - Aligned below Hibernate */}
        {/* This div ensures the table aligns with the Hibernate box's right side */}
        <div className="flex justify-end w-full">
          <Card
            className="border-4 border-black p-4 mt-8 bg-white"
            style={{ width: hibernateWidth }} // Use the state variable here
          >
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-black">Database Table</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm text-left text-black">
                <thead className="border-b-4 border-black">
                  <tr>
                    <th
                      ref={(el) => {tableHeaderRefs.current[0] = el}}
                      scope="col"
                      className="border-r-4 border-black px-6 py-3 font-bold"
                    >
                      Name
                    </th>
                    <th
                      ref={(el) => {tableHeaderRefs.current[1] = el}}
                      scope="col"
                      className="border-r-4 border-black px-6 py-3 font-bold"
                    >
                      Marks
                    </th>
                    <th
                      ref={(el) => {tableHeaderRefs.current[2] = el}}
                      scope="col"
                      className="border-r-4 border-black px-6 py-3 font-bold"
                    >
                      Gender
                    </th>
                    <th
                      ref={(el) => {tableHeaderRefs.current[3] = el}}
                      scope="col"
                      className="border-r-4 border-black px-6 py-3 font-bold"
                    >
                      Email
                    </th>
                    <th ref={(el) =>{tableHeaderRefs.current[4] = el}} scope="col" className="px-6 py-3 font-bold">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Leave rows blank for now */}
                  <tr>
                    <td className="border-r-4 border-black px-6 py-4">&nbsp;</td>
                    <td className="border-r-4 border-black px-6 py-4">&nbsp;</td>
                    <td className="border-r-4 border-black px-6 py-4">&nbsp;</td>
                    <td className="border-r-4 border-black px-6 py-4">&nbsp;</td>
                    <td className="px-6 py-4">&nbsp;</td>
                  </tr>
                  <tr>
                    <td className="border-r-4 border-black px-6 py-4">&nbsp;</td>
                    <td className="border-r-4 border-black px-6 py-4">&nbsp;</td>
                    <td className="border-r-4 border-black px-6 py-4">&nbsp;</td>
                    <td className="border-r-4 border-black px-6 py-4">&nbsp;</td>
                    <td className="px-6 py-4">&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vertical lines from JPA to table */}
      {linePositions.map((line, index) => (
        <div
          key={index}
          className="absolute border-l-4 border-black"
          style={{
            left: line.left,
            top: line.top,
            height: line.height,
            transform: "translateX(-50%)", // Center the line on its left point
          }}
        />
      ))}
    </div>
  )
}
