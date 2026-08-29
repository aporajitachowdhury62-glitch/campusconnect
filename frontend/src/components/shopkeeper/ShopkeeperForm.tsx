import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shopkeeper,
  ShopCategory,
  WorkType,
  DayOfWeek,
} from '../../types';
import {
  SHOP_CATEGORY_OPTIONS,
  WORK_TYPE_OPTIONS,
} from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { TagInput } from '../common/TagInput';
import { DayPicker } from '../common/DayPicker';
import {
  Store,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Phone,
  Banknote,
  MapPin,
} from 'lucide-react';

const SUGGESTED_SHOPKEEPER_SKILLS = [
  'Billing & POS',
  'Cash Handling',
  'Item Sorting & Packing',
  'Friendly Communication',
  'Two-Wheeler Driving',
  'Basic Computer Entry',
  'Instagram Content',
  'Stock Counting',
  'Local Language Fluency',
];

export const ShopkeeperForm: React.FC = () => {
  const navigate = useNavigate();
  const { addShopkeeper } = useApp();

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [createdListing, setCreatedListing] = useState<Shopkeeper | null>(null);

  // Form state
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState<ShopCategory>('Kirana/general store');
  const [customCategory, setCustomCategory] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [helpNeeded, setHelpNeeded] = useState<WorkType>('Shop/counter assistance');
  const [customHelpNeeded, setCustomHelpNeeded] = useState('');
  const [skillsRequired, setSkillsRequired] = useState<string[]>(['Billing & POS', 'Item Sorting & Packing']);
  const [daysNeeded, setDaysNeeded] = useState<DayOfWeek[]>(['Mon', 'Wed', 'Fri']);
  const [hoursPerDay, setHoursPerDay] = useState<number>(4);
  const [contactNumber, setContactNumber] = useState('');
  const [payEstimate, setPayEstimate] = useState('₹180 - ₹220 / hr');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalHoursPerWeek = daysNeeded.length * (Number(hoursPerDay) || 0);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!shopName.trim()) errs.shopName = 'Please enter your shop or business name';
    if (!ownerName.trim()) errs.ownerName = 'Please enter owner or manager name';
    if (category === 'Other' && !customCategory.trim()) {
      errs.customCategory = 'Please specify the category';
    }
    if (!area.trim()) errs.area = 'Locality / Area is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!state.trim()) errs.state = 'State is required';
    if (helpNeeded === 'Other' && !customHelpNeeded.trim()) {
      errs.customHelpNeeded = 'Please specify the type of help needed';
    }
    if (skillsRequired.length === 0) {
      errs.skillsRequired = 'Please specify at least 1 required skill';
    }
    if (daysNeeded.length === 0) {
      errs.daysNeeded = 'Please select at least one day required';
    }
    if (!hoursPerDay || hoursPerDay < 1 || hoursPerDay > 12) {
      errs.hoursPerDay = 'Hours per day must be between 1 and 12';
    }
    if (!contactNumber.trim()) {
      errs.contactNumber = 'Contact number is required for students to reach you';
    } else if (!/^[+]?[\d\s-]{10,14}$/.test(contactNumber.trim())) {
      errs.contactNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // TODO: Replace with API call: const response = await api.post('/api/shopkeepers', payload)
    const newEntry = addShopkeeper({
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      category,
      customCategory: category === 'Other' ? customCategory.trim() : undefined,
      area: area.trim(),
      city: city.trim(),
      state: state.trim(),
      helpNeeded,
      customHelpNeeded: helpNeeded === 'Other' ? customHelpNeeded.trim() : undefined,
      skillsRequired,
      daysNeeded,
      hoursPerDay: Number(hoursPerDay),
      contactNumber: contactNumber.trim(),
      payEstimate: payEstimate.trim() || undefined,
    });

    setCreatedListing(newEntry);
    setIsSubmitted(true);
  };

  if (isSubmitted && createdListing) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="paper-card p-6 sm:p-10 text-center border-tealdeep-200 bg-white">
          <div className="w-16 h-16 bg-tealdeep-50 text-tealdeep-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-tealdeep-200 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-widest font-bold text-tealdeep-700 bg-tealdeep-50 px-3 py-1 rounded-full border border-tealdeep-200">
            Gig Published Live
          </span>

          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink-900 mt-3 mb-2">
            Listing active for {createdListing.shopName}!
          </h2>
          <p className="text-ink-600 text-sm max-w-md mx-auto mb-6">
            College students in <strong className="text-ink-900">{createdListing.area}, {createdListing.city}</strong> can now view and apply for this requirement.
          </p>

          {/* Listing Preview Box */}
          <div className="bg-[#FAF7F2] rounded-xl p-5 text-left border border-paper-border mb-8 max-w-lg mx-auto space-y-3">
            <div className="flex items-start justify-between border-b border-paper-border pb-3">
              <div>
                <h4 className="font-heading font-bold text-ink-900 text-lg">
                  {createdListing.shopName}
                </h4>
                <p className="text-xs text-ink-600">
                  {createdListing.category} • Contact: {createdListing.ownerName} ({createdListing.contactNumber})
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-tealdeep-100 text-tealdeep-800 border border-tealdeep-200">
                {createdListing.helpNeeded}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-ink-400 block font-medium">Days Needed:</span>
                <span className="text-ink-800 font-semibold">
                  {createdListing.daysNeeded.join(', ')} ({createdListing.hoursPerDay}h/day)
                </span>
              </div>
              <div>
                <span className="text-ink-400 block font-medium">Weekly Requirement:</span>
                <span className="text-marigold-700 font-bold">
                  {createdListing.totalHoursPerWeek} hrs / week
                </span>
              </div>
              {createdListing.payEstimate && (
                <div className="col-span-2 text-xs bg-white p-2 rounded border border-paper-border">
                  <span className="text-ink-500 font-medium">Offered Stipend / Pay: </span>
                  <span className="text-ink-900 font-bold">{createdListing.payEstimate}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full sm:w-auto"
            >
              <span>View On Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setShopName('');
                setOwnerName('');
                setArea('');
              }}
              className="btn-secondary w-full sm:w-auto"
            >
              Post Another Requirement
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tealdeep-100 text-tealdeep-900 border border-tealdeep-200 text-xs font-semibold mb-2">
          <Store className="w-4 h-4 text-tealdeep-700" />
          <span>Shopkeeper Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink-900 tracking-tight">
          Find Reliable College Students for Your Shop
        </h1>
        <p className="text-sm text-ink-600 mt-1 max-w-lg mx-auto">
          Need counter assistance, deliveries, or billing help? List your shift hours and connect with students nearby.
        </p>
      </div>

      <div className="paper-card bg-white p-5 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Shop & Owner Details */}
          <div>
            <div className="border-l-4 border-tealdeep-600 pl-3 mb-4">
              <h2 className="text-lg font-heading font-bold text-ink-900">
                1. Shop & Owner Details
              </h2>
              <p className="text-xs text-ink-500">
                Basic information so local students recognize your storefront.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shop Name */}
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-1">
                  Shop / Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => {
                      setShopName(e.target.value);
                      if (errors.shopName) setErrors((prev) => ({ ...prev, shopName: '' }));
                    }}
                    placeholder="e.g. Sri Balaji Supermarket"
                    className={`paper-input w-full pl-9 ${errors.shopName ? 'border-red-400' : ''}`}
                  />
                  <Store className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
                </div>
                {errors.shopName && (
                  <p className="text-xs text-red-600 mt-1">{errors.shopName}</p>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-1">
                  Owner / Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => {
                      setOwnerName(e.target.value);
                      if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: '' }));
                    }}
                    placeholder="e.g. Ramesh Chandra"
                    className={`paper-input w-full pl-9 ${errors.ownerName ? 'border-red-400' : ''}`}
                  />
                  <User className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
                </div>
                {errors.ownerName && (
                  <p className="text-xs text-red-600 mt-1">{errors.ownerName}</p>
                )}
              </div>

              {/* Shop Category */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-ink-800 mb-1">
                  Shop Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ShopCategory)}
                  className="paper-input w-full bg-[#FDFBF7]"
                >
                  {SHOP_CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {category === 'Other' && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    Specify Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Hardware & Paint store"
                    className="paper-input w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <hr className="border-paper-border" />

          {/* Section 2: Location */}
          <div>
            <div className="border-l-4 border-tealdeep-600 pl-3 mb-4">
              <h2 className="text-lg font-heading font-bold text-ink-900">
                2. Shop Location
              </h2>
              <p className="text-xs text-ink-500">
                Where is your shop located so students within walking/bus distance can apply?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
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

              <div>
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

              <div>
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
          </div>

          <hr className="border-paper-border" />

          {/* Section 3: Help Needed & Skills Required */}
          <div>
            <div className="border-l-4 border-tealdeep-600 pl-3 mb-4">
              <h2 className="text-lg font-heading font-bold text-ink-900">
                3. Work Requirement & Schedule
              </h2>
              <p className="text-xs text-ink-500">
                Specify the exact assistance you require to ensure high-quality student matching.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-1">
                  Type of Help Needed <span className="text-red-500">*</span>
                </label>
                <select
                  value={helpNeeded}
                  onChange={(e) => setHelpNeeded(e.target.value as WorkType)}
                  className="paper-input w-full bg-[#FDFBF7]"
                >
                  {WORK_TYPE_OPTIONS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              {helpNeeded === 'Other' && (
                <div>
                  <label className="block text-sm font-semibold text-ink-800 mb-1">
                    Describe Help Needed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customHelpNeeded}
                    onChange={(e) => setCustomHelpNeeded(e.target.value)}
                    placeholder="e.g. Stock sorting and price tagging"
                    className="paper-input w-full"
                  />
                </div>
              )}

              {/* Skills Required TagInput */}
              <TagInput
                label="Skills Required from Student"
                helperText="Type any requirement and press Enter or select from presets below"
                tags={skillsRequired}
                onChange={(tags) => {
                  setSkillsRequired(tags);
                  if (errors.skillsRequired) setErrors((prev) => ({ ...prev, skillsRequired: '' }));
                }}
                suggestedTags={SUGGESTED_SHOPKEEPER_SKILLS}
                error={errors.skillsRequired}
              />

              {/* Days Needed Multi-select */}
              <DayPicker
                label="Days Needed"
                helperText="Select which days you need student presence"
                selectedDays={daysNeeded}
                onChange={(days) => {
                  setDaysNeeded(days);
                  if (errors.daysNeeded) setErrors((prev) => ({ ...prev, daysNeeded: '' }));
                }}
                error={errors.daysNeeded}
              />

              {/* Hours needed per day */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-paper-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-ink-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-tealdeep-700" />
                    <span>Hours Needed Per Day</span>
                  </label>
                  <span className="text-base font-heading font-bold text-tealdeep-800 bg-tealdeep-100 px-3 py-0.5 rounded-lg border border-tealdeep-200">
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
                  className="w-full h-2 bg-paper-border rounded-lg appearance-none cursor-pointer accent-tealdeep-700"
                />

                <div className="mt-4 pt-3 border-t border-paper-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-lg border">
                  <div>
                    <span className="text-xs text-ink-500 font-medium block">
                      Total Commitment Expected:
                    </span>
                    <p className="text-xs text-ink-700">
                      {daysNeeded.length} days × {hoursPerDay} hrs/day
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-heading font-bold text-tealdeep-800">
                      {totalHoursPerWeek} hrs / week
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-paper-border" />

          {/* Section 4: Contact & Compensation */}
          <div>
            <div className="border-l-4 border-tealdeep-600 pl-3 mb-4">
              <h2 className="text-lg font-heading font-bold text-ink-900">
                4. Contact & Compensation
              </h2>
              <p className="text-xs text-ink-500">
                Direct phone number for verified students to connect.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-1">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => {
                      setContactNumber(e.target.value);
                      if (errors.contactNumber) setErrors((prev) => ({ ...prev, contactNumber: '' }));
                    }}
                    placeholder="+91 98765 43210"
                    className={`paper-input w-full pl-9 ${errors.contactNumber ? 'border-red-400' : ''}`}
                  />
                  <Phone className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
                </div>
                {errors.contactNumber && (
                  <p className="text-xs text-red-600 mt-1">{errors.contactNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-800 mb-1">
                  Stipend / Pay Rate <span className="text-xs text-ink-500">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={payEstimate}
                    onChange={(e) => setPayEstimate(e.target.value)}
                    placeholder="e.g. ₹200/hr or ₹5,000/mo"
                    className="paper-input w-full pl-9"
                  />
                  <Banknote className="w-4 h-4 text-ink-400 absolute left-3 top-3.5" />
                </div>
                <p className="text-[11px] text-ink-400 mt-1">Gives students an estimate</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="btn-teal w-full text-base py-3 rounded-xl shadow-md"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Publish Gig & Start Matching Students</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopkeeperForm;
