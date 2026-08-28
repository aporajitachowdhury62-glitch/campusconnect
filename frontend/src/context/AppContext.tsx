import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Shopkeeper, ConnectionRequest, VendorQAQC, UserRoleType } from '../types';
import { INITIAL_STUDENTS, INITIAL_SHOPKEEPERS } from '../data/mockData';
import { connectionService } from '../services/connectionService';
import { vendorService } from '../services/vendorService';
import { ratingService } from '../services/ratingService';

interface AppContextType {
  students: Student[];
  shopkeepers: Shopkeeper[];
  addStudent: (newStudent: Omit<Student, 'id' | 'createdAt' | 'totalHoursPerWeek'>) => Student;
  addShopkeeper: (newShopkeeper: Omit<Shopkeeper, 'id' | 'createdAt' | 'totalHoursPerWeek'>) => Shopkeeper;
  updateShopkeeperQA: (vendorId: string, updatedQA: VendorQAQC) => void;
  recentAddedId: string | null;
  clearRecentAdded: () => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentEmployerId: string;
  setCurrentEmployerId: (id: string) => void;
  studentApplicationsCount: number;
  employerPendingCount: number;
  studentPendingRatingsCount: number;
  employerPendingRatingsCount: number;
  refreshCounters: () => Promise<void>;
  sendConnection: (
    shopkeeper: Shopkeeper,
    customMessage?: string
  ) => Promise<ConnectionRequest>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [shopkeepers, setShopkeepers] = useState<Shopkeeper[]>(INITIAL_SHOPKEEPERS);
  const [recentAddedId, setRecentAddedId] = useState<string | null>(null);

  // Active simulated personas for demo
  const [currentStudentId, setCurrentStudentId] = useState<string>('std-1');
  const [currentEmployerId, setCurrentEmployerId] = useState<string>('shp-3');

  // Application & Inbox & Rating counts
  const [studentApplicationsCount, setStudentApplicationsCount] = useState<number>(0);
  const [employerPendingCount, setEmployerPendingCount] = useState<number>(0);
  const [studentPendingRatingsCount, setStudentPendingRatingsCount] = useState<number>(0);
  const [employerPendingRatingsCount, setEmployerPendingRatingsCount] = useState<number>(0);

  const clearRecentAdded = () => setRecentAddedId(null);

  const refreshCounters = async () => {
    try {
      const studentReqs = await connectionService.fetchStudentRequests(currentStudentId);
      setStudentApplicationsCount(studentReqs.length);

      const employerReqs = await connectionService.fetchEmployerRequests(currentEmployerId);
      const pending = employerReqs.filter((r) => r.status === 'sent' || r.status === 'seen').length;
      setEmployerPendingCount(pending);

      const [stdPending, empPending] = await Promise.all([
        ratingService.fetchPendingRatings(currentStudentId, 'student'),
        ratingService.fetchPendingRatings(currentEmployerId, 'shopkeeper'),
      ]);
      setStudentPendingRatingsCount(stdPending.length);
      setEmployerPendingRatingsCount(empPending.length);
    } catch (e) {
      console.error('Failed refreshing counters', e);
    }
  };

  useEffect(() => {
    refreshCounters();
  }, [currentStudentId, currentEmployerId]);

  const updateShopkeeperQA = (vendorId: string, updatedQA: VendorQAQC) => {
    setShopkeepers((prev) =>
      prev.map((s) => {
        if (s.id === vendorId) {
          return {
            ...s,
            qa_status: updatedQA.qa_status,
            qa_verified_at: updatedQA.qa_verified_at,
            qc_score: updatedQA.qc_score,
            qc_review_count: updatedQA.qc_review_count,
          };
        }
        return s;
      })
    );
  };

  const addStudent = (
    studentData: Omit<Student, 'id' | 'createdAt' | 'totalHoursPerWeek'>
  ): Student => {
    const calculatedTotalHours =
      (studentData.daysAvailable?.length || 0) * (studentData.hoursPerDay || 0);

    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      totalHoursPerWeek: calculatedTotalHours,
      createdAt: new Date().toISOString(),
      avg_rating: 0,
      rating_count: 0,
    };

    setStudents((prev) => [newStudent, ...prev]);
    setRecentAddedId(newStudent.id);
    return newStudent;
  };

  const addShopkeeper = (
    shopkeeperData: Omit<Shopkeeper, 'id' | 'createdAt' | 'totalHoursPerWeek'>
  ): Shopkeeper => {
    const calculatedTotalHours =
      (shopkeeperData.daysNeeded?.length || 0) * (shopkeeperData.hoursPerDay || 0);

    const newShopkeeper: Shopkeeper = {
      ...shopkeeperData,
      id: `shp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      totalHoursPerWeek: calculatedTotalHours,
      createdAt: new Date().toISOString(),
      qa_status:
        shopkeeperData.category === 'Food/restaurant' ? 'pending' : undefined,
      avg_rating: 0,
      rating_count: 0,
    };

    setShopkeepers((prev) => [newShopkeeper, ...prev]);
    setRecentAddedId(newShopkeeper.id);
    return newShopkeeper;
  };

  const sendConnection = async (
    shopkeeper: Shopkeeper,
    customMessage?: string
  ): Promise<ConnectionRequest> => {
    const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

    const defaultMsg = `Hi ${shopkeeper.ownerName}, I am ${currentStudent.name} from ${currentStudent.collegeName}. I am available for ${shopkeeper.helpNeeded} (${shopkeeper.daysNeeded.join(', ')})!`;

    const req = await connectionService.sendConnectionRequest({
      student_id: currentStudent.id,
      student_name: currentStudent.name,
      student_college: currentStudent.collegeName,
      student_phone: currentStudent.phone,
      student_skills: currentStudent.skills,
      employer_id: shopkeeper.id,
      employer_name: shopkeeper.ownerName,
      shop_name: shopkeeper.shopName,
      job_id: shopkeeper.id,
      job_title: shopkeeper.helpNeeded,
      message: customMessage || defaultMsg,
    });

    await refreshCounters();
    return req;
  };

  return (
    <AppContext.Provider
      value={{
        students,
        shopkeepers,
        addStudent,
        addShopkeeper,
        updateShopkeeperQA,
        recentAddedId,
        clearRecentAdded,
        currentStudentId,
        setCurrentStudentId,
        currentEmployerId,
        setCurrentEmployerId,
        studentApplicationsCount,
        employerPendingCount,
        studentPendingRatingsCount,
        employerPendingRatingsCount,
        refreshCounters,
        sendConnection,
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
