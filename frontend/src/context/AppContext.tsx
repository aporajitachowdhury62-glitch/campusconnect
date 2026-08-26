import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Shopkeeper } from '../types';
import { INITIAL_STUDENTS, INITIAL_SHOPKEEPERS } from '../data/mockData';

interface AppContextType {
  students: Student[];
  shopkeepers: Shopkeeper[];
  addStudent: (newStudent: Omit<Student, 'id' | 'createdAt' | 'totalHoursPerWeek'>) => Student;
  addShopkeeper: (newShopkeeper: Omit<Shopkeeper, 'id' | 'createdAt' | 'totalHoursPerWeek'>) => Shopkeeper;
  recentAddedId: string | null;
  clearRecentAdded: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-memory state holding students and shopkeepers
  // TODO: Replace with FastAPI endpoint fetch: const response = await api.get('/api/students')
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  // TODO: Replace with FastAPI endpoint fetch: const response = await api.get('/api/shopkeepers')
  const [shopkeepers, setShopkeepers] = useState<Shopkeeper[]>(INITIAL_SHOPKEEPERS);

  // Track newly registered entities during current session for subtle UI highlight badge
  const [recentAddedId, setRecentAddedId] = useState<string | null>(null);

  const clearRecentAdded = () => setRecentAddedId(null);

  /**
   * Register a new student profile into shared in-memory store
   */
  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'totalHoursPerWeek'>): Student => {
    // Calculate total hours per week derived from days * hours/day
    const calculatedTotalHours = (studentData.daysAvailable?.length || 0) * (studentData.hoursPerDay || 0);

    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      totalHoursPerWeek: calculatedTotalHours,
      createdAt: new Date().toISOString(),
    };

    // TODO: Replace with API call -> await axios.post('/api/students', newStudent);
    setStudents((prev) => [newStudent, ...prev]);
    setRecentAddedId(newStudent.id);
    return newStudent;
  };

  /**
   * Register a new shopkeeper gig listing into shared in-memory store
   */
  const addShopkeeper = (shopkeeperData: Omit<Shopkeeper, 'id' | 'createdAt' | 'totalHoursPerWeek'>): Shopkeeper => {
    // Calculate total hours per week derived from days * hours/day
    const calculatedTotalHours = (shopkeeperData.daysNeeded?.length || 0) * (shopkeeperData.hoursPerDay || 0);

    const newShopkeeper: Shopkeeper = {
      ...shopkeeperData,
      id: `shp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      totalHoursPerWeek: calculatedTotalHours,
      createdAt: new Date().toISOString(),
    };

    // TODO: Replace with API call -> await axios.post('/api/shopkeepers', newShopkeeper);
    setShopkeepers((prev) => [newShopkeeper, ...prev]);
    setRecentAddedId(newShopkeeper.id);
    return newShopkeeper;
  };

  return (
    <AppContext.Provider
      value={{
        students,
        shopkeepers,
        addStudent,
        addShopkeeper,
        recentAddedId,
        clearRecentAdded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
