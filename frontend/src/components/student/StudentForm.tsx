import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Student,
  Qualification,
  WorkType,
  TimeOfDay,
  DayOfWeek,
} from '../../types';
import {
  QUALIFICATION_OPTIONS,
  WORK_TYPE_OPTIONS,
  TIME_OF_DAY_OPTIONS,
} from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { RouteProgressBar } from './RouteProgressBar';
import { TagInput } from '../common/TagInput';
import { DayPicker } from '../common/DayPicker';
import { MultiSelectPills } from '../common/MultiSelectPills';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Clock,
  Building2,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

const SUGGESTED_STUDENT_SKILLS = [
  'Billing & POS',
  'Excel & Google Sheets',
  'Customer Assistance',
  'Two-Wheeler Driving',
  'Canva Design',
  'Social Media Reels',
  'Maths/Science Tutoring',
  'Stock Inventory',
  'Fluent English',
  'Fast Typing',
];

export const StudentForm: React.FC = () => {
  const navigate = useNavigate();
  const { addStudent } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [createdStudent, setCreatedStudent] = useState<Student | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(20);
  const [collegeName, setCollegeName] = useState('');
  const [qualification, setQualification] = useState<Qualification>('B.Tech/B.E.');
  const [customQualification, setCustomQualification] = useState('');
  
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [preferredWorkType, setPreferredWorkType] = useState<WorkType>('Shop/counter assistance');
  const [customWorkType, setCustomWorkType] = useState('');
  const [preferredTimeOfDay, setPreferredTimeOfDay] = useState<TimeOfDay[]>(['Evening']);

  const [skills, setSkills] = useState<string[]>(['Billing & POS', 'Customer Assistance']);
  const [daysAvailable, setDaysAvailable] = useState<DayOfWeek[]>(['Fri', 'Sat', 'Sun']);
  const [hoursPerDay, setHoursPerDay] = useState<number>(4);
  const [phone, setPhone] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Derived calculations
  const totalHoursPerWeek = daysAvailable.length * (Number(hoursPerDay) || 0);

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your name';
    if (!age || age < 15 || age > 30) {
      errs.age = 'Age must be between 15 and 30 years';
    }
    if (!collegeName.trim()) {
      errs.collegeName = 'Please enter your college or institution name';
    }
    if (qualification === 'Other' && !customQualification.trim()) {
      errs.customQualification = 'Please specify your qualification';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!area.trim()) errs.area = 'Locality / Area is required (e.g. Koramangala)';
    if (!city.trim()) errs.city = 'City is required (e.g. Bengaluru)';
    if (!state.trim()) errs.state = 'State is required (e.g. Karnataka)';
    if (preferredWorkType === 'Other' && !customWorkType.trim()) {
      errs.customWorkType = 'Please describe your preferred work';
    }
    if (preferredTimeOfDay.length === 0) {
      errs.preferredTimeOfDay = 'Select at least one preferred time slot';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (skills.length === 0) {
      errs.skills = 'Please add at least 1 skill';
    }
    if (daysAvailable.length === 0) {
      errs.daysAvailable = 'Please select at least 1 available day';
    }
    if (!hoursPerDay || hoursPerDay < 1 || hoursPerDay > 12) {
      errs.hoursPerDay = 'Hours per day must be between 1 and 12';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    // TODO: Replace with API call: const response = await api.post('/api/students', payload)
    const newEntry = addStudent({
      name: name.trim(),
      age: Number(age),
      collegeName: collegeName.trim(),
      qualification,
      customQualification: qualification === 'Other' ? customQualification.trim() : undefined,
      area: area.trim(),
      city: city.trim(),
      state: state.trim(),
      skills,
      preferredWorkType,
      customWorkType: preferredWorkType === 'Other' ? customWorkType.trim() : undefined,
      preferredTimeOfDay,
      daysAvailable,
      hoursPerDay: Number(hoursPerDay),
      phone: phone.trim() || undefined,
    });

    setCreatedStudent(newEntry);
    setIsSubmitted(true);
  };

  if (isSubmitted && createdStudent) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="paper-card p-6 sm:p-10 text-center border-tealdeep-200 bg-white">
          <div className="w-16 h-16 bg-tealdeep-50 text-tealdeep-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-tealdeep-200 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-widest font-bold text-tealdeep-700 bg-tealdeep-50 px-3 py-1 rounded-full border border-tealdeep-200">
            Registration Complete
          </span>

          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink-900 mt-3 mb-2">
            You're on the local map, {createdStudent.name}!
          </h2>
          <p className="text-ink-600 text-sm max-w-md mx-auto mb-6">
            Your profile is now live for verified local shopkeepers around{' '}
            <strong className="text-ink-900">{createdStudent.area}, {createdStudent.city}</strong>.
          </p>

          {/* Profile Summary Card */}
          <div className="bg-[#FAF7F2] rounded-xl p-5 text-left border border-paper-border mb-8 max-w-lg mx-auto space-y-3">
            <div className="flex items-start justify-between border-b border-paper-border pb-3">
              <div>
                <h4 className="font-heading font-bold text-ink-900 text-lg">
                  {createdStudent.name}
                </h4>
                <p className="text-xs text-ink-600">
                  {createdStudent.qualification} • {createdStudent.collegeName} (Age {createdStudent.age})
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-marigold-100 text-marigold-800 border border-marigold-200">
                {createdStudent.preferredWorkType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-ink-400 block font-medium">Availability:</span>
                <span className="text-ink-800 font-semibold">
                  {createdStudent.daysAvailable.join(', ')} ({createdStudent.hoursPerDay}h/day)
                </span>
              </div>
              <div>
                <span className="text-ink-400 block font-medium">Weekly Commitment:</span>
                <span className="text-marigold-700 font-bold">
                  {createdStudent.totalHoursPerWeek} hrs / week
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-ink-400 block font-medium mb-1">Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {createdStudent.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-white text-ink-700 border border-paper-border text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full sm:w-auto"
            >
              <span>Explore Gigs on Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                setName('');
                setCollegeName('');
                setArea('');
              }}
              className="btn-secondary w-full sm:w-auto"
            >
              Register Another Student
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-4">
      {/* Page Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold-100 text-marigold-900 border border-marigold-200 text-xs font-semibold mb-2">
          <GraduationCap className="w-4 h-4 text-marigold-700" />
          <span>Student Onboarding Route</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink-900 tracking-tight">
          Find Local Part-Time Work Near Your Campus
        </h1>
        <p className="text-sm text-ink-600 mt-1 max-w-lg mx-auto">
          Share your skills and class schedule to get matched with nearby shops in 3 quick stops.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="paper-card bg-white p-5 sm:p-8">
        {/* Visual Route Progress Bar */}
        <RouteProgressBar
          currentStep={currentStep}
          totalSteps={3}
          onStepClick={(step) => {
            if (step < currentStep) setCurrentStep(step);
          }}
        />

        <hr className="my-6 border-paper-border" />

        <form onSubmit={handleSubmit}>
          {/* ========================================================
              STOP 1: Student Identity, College & Qualification
             ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-l-4 border-marigold-500 pl-3">
                <h2 className="text-lg font-heading font-bold text-ink-900">
                  Stop 1: Identity & Education
                </h2>
                <p className="text-xs text-ink-500">
                  Tell us a bit about who you are and where you study.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder="e.g. Aarav Sharma"
                      className={`paper-input w-full pl-9 ${errors.name ? 'border-red-400' : ''}`}
                    />
                    <User className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={30}
                    value={age}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                      setAge(val);
                      if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
                    }}
                    placeholder="18-25"
                    className={`paper-input w-full ${errors.age ? 'border-red-400' : ''}`}
                  />
                  {errors.age ? (
                    <p className="text-xs text-red-600 mt-1">{errors.age}</p>
                  ) : (
                    <p className="text-[11px] text-ink-400 mt-1">Must be 15–30 years old</p>
                  )}
                </div>

                {/* Qualification Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    Current Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value as Qualification)}
                    className="paper-input w-full bg-[#FDFBF7]"
                  >
                    {QUALIFICATION_OPTIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Qualification if Other */}
                {qualification === 'Other' && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-ink-800 mb-1">
                      Specify Qualification <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customQualification}
                      onChange={(e) => {
                        setCustomQualification(e.target.value);
                        if (errors.customQualification) setErrors((prev) => ({ ...prev, customQualification: '' }));
                      }}
                      placeholder="e.g. Diploma in Graphic Design"
                      className={`paper-input w-full ${errors.customQualification ? 'border-red-400' : ''}`}
                    />
                    {errors.customQualification && (
                      <p className="text-xs text-red-600 mt-1">{errors.customQualification}</p>
                    )}
                  </div>
                )}

                {/* College Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    College / University Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => {
                        setCollegeName(e.target.value);
                        if (errors.collegeName) setErrors((prev) => ({ ...prev, collegeName: '' }));
                      }}
                      placeholder="e.g. St. Xavier's College / PES University"
                      className={`paper-input w-full pl-9 ${errors.collegeName ? 'border-red-400' : ''}`}
                    />
                    <Building2 className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
                  </div>
                  {errors.collegeName && (
                    <p className="text-xs text-red-600 mt-1">{errors.collegeName}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STOP 2: Locality & Preferred Work
             ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-l-4 border-marigold-500 pl-3">
                <h2 className="text-lg font-heading font-bold text-ink-900">
                  Stop 2: Hyperlocal Zone & Work Type
                </h2>
                <p className="text-xs text-ink-500">
                  Where are you located and what kind of roles fit your strengths?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Area / Locality */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    Area / Locality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      if (errors.area) setErrors((prev) => ({ ...prev, area: '' }));
                    }}
                    placeholder="e.g. Koramangala 4th Block"
                    className={`paper-input w-full ${errors.area ? 'border-red-400' : ''}`}
                  />
                  {errors.area && (
                    <p className="text-xs text-red-600 mt-1">{errors.area}</p>
                  )}
                </div>

                {/* City */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                    }}
                    placeholder="e.g. Bengaluru"
                    className={`paper-input w-full ${errors.city ? 'border-red-400' : ''}`}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                  )}
                </div>

                {/* State */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (errors.state) setErrors((prev) => ({ ...prev, state: '' }));
                    }}
                    placeholder="e.g. Karnataka"
                    className={`paper-input w-full ${errors.state ? 'border-red-400' : ''}`}
                  />
                  {errors.state && (
                    <p className="text-xs text-red-600 mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              {/* Preferred Work Type */}
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-1">
                  Preferred Work Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={preferredWorkType}
                  onChange={(e) => setPreferredWorkType(e.target.value as WorkType)}
                  className="paper-input w-full bg-[#FDFBF7]"
                >
                  {WORK_TYPE_OPTIONS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              {/* If Other Work Type */}
              {preferredWorkType === 'Other' && (
                <div>
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    Describe Preferred Work <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customWorkType}
                    onChange={(e) => {
                      setCustomWorkType(e.target.value);
                      if (errors.customWorkType) setErrors((prev) => ({ ...prev, customWorkType: '' }));
                    }}
                    placeholder="e.g. Cafe barista & latte art"
                    className={`paper-input w-full ${errors.customWorkType ? 'border-red-400' : ''}`}
                  />
                  {errors.customWorkType && (
                    <p className="text-xs text-red-600 mt-1">{errors.customWorkType}</p>
                  )}
                </div>
              )}

              {/* Preferred Time of Day */}
              <MultiSelectPills
                label="Preferred Time of Day"
                helperText="Select which shifts fit your class timetable best"
                options={TIME_OF_DAY_OPTIONS}
                selected={preferredTimeOfDay}
                onChange={setPreferredTimeOfDay}
                error={errors.preferredTimeOfDay}
                colorScheme="amber"
              />
            </div>
          )}

          {/* ========================================================
              STOP 3: Availability & Skills
             ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-l-4 border-marigold-500 pl-3">
                <h2 className="text-lg font-heading font-bold text-ink-900">
                  Stop 3: Availability & Skills
                </h2>
                <p className="text-xs text-ink-500">
                  Define your weekly hours and showcase your practical skills.
                </p>
              </div>

              {/* Skills Tag Input */}
              <TagInput
                label="Your Practical Skills"
                helperText="Type any skill and hit Enter or click a suggestion below"
                tags={skills}
                onChange={(newSkills) => {
                  setSkills(newSkills);
                  if (errors.skills) setErrors((prev) => ({ ...prev, skills: '' }));
                }}
                suggestedTags={SUGGESTED_STUDENT_SKILLS}
                error={errors.skills}
              />

              {/* Days Available Multi-Select */}
              <DayPicker
                label="Days Available"
                helperText="Choose which days of the week you are free for work"
                selectedDays={daysAvailable}
                onChange={(days) => {
                  setDaysAvailable(days);
                  if (errors.daysAvailable) setErrors((prev) => ({ ...prev, daysAvailable: '' }));
                }}
                error={errors.daysAvailable}
              />

              {/* Hours Available Per Day Slider + Number */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-paper-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-ink-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-marigold-600" />
                    <span>Hours Available Per Day</span>
                  </label>
                  <span className="text-base font-heading font-bold text-marigold-800 bg-marigold-100 px-3 py-0.5 rounded-lg border border-marigold-200">
                    {hoursPerDay} hrs / day
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-paper-border rounded-lg appearance-none cursor-pointer accent-marigold-600"
                />

                <div className="flex justify-between text-[11px] text-ink-400 font-medium">
                  <span>1 hr (Quick gig)</span>
                  <span>4 hrs (Half shift)</span>
                  <span>8 hrs (Full shift)</span>
                  <span>12 hrs (Max)</span>
                </div>

                {/* Dynamic Calculated Summary Box */}
                <div className="mt-4 pt-3 border-t border-paper-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-lg border">
                  <div>
                    <span className="text-xs text-ink-500 font-medium block">
                      Calculated Weekly Commitment (Read-Only):
                    </span>
                    <p className="text-xs text-ink-700">
                      {daysAvailable.length} days selected × {hoursPerDay} hrs/day
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider text-ink-400 font-bold block">
                      Total Output
                    </span>
                    <span className="text-lg font-heading font-bold text-tealdeep-800">
                      {totalHoursPerWeek} hrs / week
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional Contact Phone */}
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-1">
                  Contact Number <span className="text-xs font-normal text-ink-500">(Optional - for shopkeeper callbacks)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="paper-input w-full"
                />
              </div>
            </div>
          )}

          {/* Form Actions / Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-paper-border mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Stop {currentStep - 1}</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                <span>Continue to Stop {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="btn-teal"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Route & Publish Profile</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
