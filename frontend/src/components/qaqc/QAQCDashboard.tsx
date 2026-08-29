import React, { useState, useEffect } from 'react';
import { QAQCTask, QAStatus, QAQCRole } from '../../types';
import { QAQCCard } from './QAQCCard';
import { AdminQAPanel } from './AdminQAPanel';
import { ReviewList } from './ReviewList';
import { VendorQADetailModal } from './VendorQADetailModal';
import { RoleBadge } from '../common/RoleBadge';
import { vendorService } from '../../services/vendorService';
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  BarChart3,
  Building2,
  Sparkles,
  ClipboardList,
  MessageSquareWarning,
} from 'lucide-react';

const INITIAL_QAQC_TASKS: QAQCTask[] = [
  {
    id: 'task-101',
    vendorId: 'shp-3',
    vendorName: 'Green Leaf Organic Cafe & Bakery',
    category: 'Food/restaurant',
    taskType: 'hygiene_audit',
    title: 'Biannual Food Safety & Kitchen Sanitization Audit',
    description: 'Verify kitchen exhaust cleanout, organic raw materials supplier certificates, and staff health checkups.',
    priority: 'medium',
    status: 'completed',
    assignedTo: 'Officer Sharma',
    assignedRole: 'Food Safety Officer',
    dueDate: '2026-09-05T00:00:00Z',
    createdAt: '2026-08-20T10:00:00Z',
    completedAt: '2026-08-22T14:30:00Z',
    score: 4.8,
  },
  {
    id: 'task-102',
    vendorId: 'shp-6',
    vendorName: 'Rolls & Bowls Campus Diner',
    category: 'Food/restaurant',
    taskType: 'document_verification',
    title: 'FSSAI License Renewal & Water Quality Certificate Check',
    description: 'Audit newly submitted municipal trade license and FSSAI 14-digit central license verification with portal records.',
    priority: 'urgent',
    status: 'pending',
    assignedTo: 'Officer Verma',
    assignedRole: 'Lead Inspector',
    dueDate: '2026-08-30T00:00:00Z',
    createdAt: '2026-08-24T09:00:00Z',
    score: 4.2,
  },
  {
    id: 'task-103',
    vendorId: 'shp-7',
    vendorName: 'Annapurna South Tiffin & Juice Bar',
    category: 'Food/restaurant',
    taskType: 'spot_check',
    title: 'Freshness & Oil Reuse Quality Spot Check',
    description: 'On-site digital polar test of cooking oil and cold storage temperature log inspection.',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Auditor Iyer',
    assignedRole: 'Hygiene Auditor',
    dueDate: '2026-09-10T00:00:00Z',
    createdAt: '2026-08-23T11:00:00Z',
    completedAt: '2026-08-24T16:00:00Z',
    score: 4.6,
  },
  {
    id: 'task-104',
    vendorId: 'shp-8',
    vendorName: 'Midnight Munchies Street Fast Food',
    category: 'Food/restaurant',
    taskType: 'flag_investigation',
    title: 'Student Cleanliness Flag & Oil Smell Investigation',
    description: 'Investigate student worker report regarding food preparation counter sanitization protocol.',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Lead Inspector Rao',
    assignedRole: 'Lead Inspector',
    dueDate: '2026-08-31T00:00:00Z',
    createdAt: '2026-08-27T20:00:00Z',
    score: 3.1,
  },
];

export const QAQCDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<QAQCTask[]>(INITIAL_QAQC_TASKS);
  const [activeTab, setActiveTab] = useState<'tasks' | 'compliance' | 'reviews'>('tasks');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInspectionVendor, setSelectedInspectionVendor] = useState<{ id: string; name: string; category: string } | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskVendor, setNewTaskVendor] = useState<string>('Rolls & Bowls Campus Diner');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleTaskAction = (action: 'approve' | 'reject' | 'inspect' | 'complete', taskId?: string) => {
    if (!taskId) return;

    if (action === 'approve' || action === 'complete') {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: 'completed', completedAt: new Date().toISOString() }
            : t
        )
      );
    } else if (action === 'reject') {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: 'rejected' } : t))
      );
    } else if (action === 'inspect') {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setSelectedInspectionVendor({
          id: task.vendorId,
          name: task.vendorName,
          category: task.category,
        });
      }
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: QAQCTask = {
      id: `task-${Date.now()}`,
      vendorId: 'shp-6',
      vendorName: newTaskVendor,
      category: 'Food/restaurant',
      taskType: 'document_verification',
      title: newTaskTitle.trim(),
      description: 'Scheduled audit for hygiene, license compliance, and safety standards.',
      priority: newTaskPriority,
      status: 'pending',
      assignedTo: 'Lead Inspector Rao',
      assignedRole: 'Lead Inspector',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      score: 4.5,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setIsTaskModalOpen(false);
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-tealdeep-900 via-tealdeep-800 to-ink-900 text-white rounded-3xl p-6 sm:p-8 shadow-warm-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-marigold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tealdeep-700/80 text-tealdeep-100 text-xs font-bold border border-tealdeep-500/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>QA/QC Safety & Inspection System</span>
              </span>
              <RoleBadge role="QAC" size="sm" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Quality Assurance & Quality Control Dashboard
            </h1>
            <p className="text-tealdeep-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time food safety audits, FSSAI verification, hygiene score management, and student quality reports for CampusConnect establishments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTaskModalOpen(true)}
            className="self-start md:self-auto bg-marigold-500 hover:bg-marigold-400 text-ink-950 font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Audit Task</span>
          </button>
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-tealdeep-700/60 text-xs">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl">
            <span className="text-tealdeep-200 block text-[11px] font-medium">Total Audit Tasks</span>
            <span className="font-heading font-bold text-xl text-white">{tasks.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl">
            <span className="text-tealdeep-200 block text-[11px] font-medium">Passed & Verified</span>
            <span className="font-heading font-bold text-xl text-emerald-300">{completedCount}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl">
            <span className="text-tealdeep-200 block text-[11px] font-medium">Pending Review</span>
            <span className="font-heading font-bold text-xl text-amber-300">{pendingCount}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl">
            <span className="text-tealdeep-200 block text-[11px] font-medium">High Priority</span>
            <span className="font-heading font-bold text-xl text-rose-300">{highPriorityCount}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-paper-border pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'bg-ink-900 text-white shadow-sm'
              : 'bg-white text-ink-600 hover:bg-paper-100 border border-paper-border'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Audit Tasks ({tasks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compliance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'compliance'
              ? 'bg-ink-900 text-white shadow-sm'
              : 'bg-white text-ink-600 hover:bg-paper-100 border border-paper-border'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Vendor Compliance & FSSAI Portal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-ink-900 text-white shadow-sm'
              : 'bg-white text-ink-600 hover:bg-paper-100 border border-paper-border'
          }`}
        >
          <MessageSquareWarning className="w-4 h-4" />
          <span>Student Quality Reviews & Flags</span>
        </button>
      </div>

      {/* Tab 1: Audit Tasks Grid */}
      {activeTab === 'tasks' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-paper-border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audits, vendor name, keywords..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-paper-50 border border-paper-border focus:outline-none focus:ring-2 focus:ring-marigold-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {['all', 'pending', 'in_progress', 'completed', 'rejected'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-tealdeep-800 text-white'
                      : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-paper-border space-y-2">
              <AlertTriangle className="w-8 h-8 text-ink-400 mx-auto" />
              <h3 className="font-heading font-bold text-ink-800 text-base">No tasks match your criteria</h3>
              <p className="text-xs text-ink-500">Try changing the status filter or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {filteredTasks.map((task) => (
                <QAQCCard
                  key={task.id}
                  task={task}
                  onAction={handleTaskAction}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Vendor Compliance & FSSAI Audit Panel */}
      {activeTab === 'compliance' && (
        <div className="animate-in fade-in">
          <AdminQAPanel />
        </div>
      )}

      {/* Tab 3: Student Quality Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 rounded-2xl border border-paper-border shadow-2xs space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-lg font-heading font-bold text-ink-900">Student Workplace & Quality Reviews</h2>
            <p className="text-xs text-ink-500">
              Community audits submitted by verified students after completed work shifts.
            </p>
          </div>
          <ReviewList vendorId="shp-3" />
        </div>
      )}

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-paper-border shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-paper-border">
              <h3 className="font-heading font-bold text-lg text-ink-900">Create New QA/QC Audit Task</h3>
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="text-ink-400 hover:text-ink-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-ink-800 mb-1">Target Vendor</label>
                <select
                  value={newTaskVendor}
                  onChange={(e) => setNewTaskVendor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-paper-border bg-paper-50 font-medium"
                >
                  <option value="Rolls & Bowls Campus Diner">Rolls & Bowls Campus Diner</option>
                  <option value="Green Leaf Organic Cafe & Bakery">Green Leaf Organic Cafe & Bakery</option>
                  <option value="Annapurna South Tiffin & Juice Bar">Annapurna South Tiffin & Juice Bar</option>
                  <option value="Midnight Munchies Street Fast Food">Midnight Munchies Street Fast Food</option>
                  <option value="Sri Venkateshwara Supermarket">Sri Venkateshwara Supermarket</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ink-800 mb-1">Audit Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. FSSAI Renewal & Cleanliness Spot Check"
                  className="w-full p-2.5 rounded-xl border border-paper-border bg-paper-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-800 mb-1">Priority Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`p-2 rounded-lg font-semibold uppercase text-[10px] border transition-all ${
                        newTaskPriority === p
                          ? 'bg-tealdeep-800 text-white border-tealdeep-900 shadow-xs'
                          : 'bg-paper-50 text-ink-600 border-paper-border'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-paper-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 text-xs font-semibold"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Detail Modal */}
      {selectedInspectionVendor && (
        <VendorQADetailModal
          isOpen={Boolean(selectedInspectionVendor)}
          onClose={() => setSelectedInspectionVendor(null)}
          vendorId={selectedInspectionVendor.id}
          vendorName={selectedInspectionVendor.name}
          category={selectedInspectionVendor.category}
        />
      )}
    </div>
  );
};

export default QAQCDashboard;
