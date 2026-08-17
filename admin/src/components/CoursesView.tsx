import React, { useState } from "react";
import { 
  Plus, Edit3, Trash2, Calendar, BookOpen, AlertCircle, CheckCircle, Clock, Tag, Briefcase, Users
} from "lucide-react";
import { useApp } from "../context/AppContext.js";
import { Course, Batch, CourseStatus, BatchStatus, UserRole } from "../types.js";

export const CoursesView: React.FC = () => {
  const { 
    courses, batches, addCourse, updateCourse, deleteCourse, 
    addBatch, updateBatch, deleteBatch, currentUser, students 
  } = useApp();

  // Navigation / Modal States
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState<boolean>(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [isAddingBatch, setIsAddingBatch] = useState<boolean>(false);

  // Form states: Course
  const [courseName, setCourseName] = useState<string>("");
  const [courseDuration, setCourseDuration] = useState<string>("3 Months");
  const [courseFee, setCourseFee] = useState<number>(20000);
  const [courseDesc, setCourseDesc] = useState<string>("");
  const [courseStatus, setCourseStatus] = useState<CourseStatus>(CourseStatus.Active);

  // Form states: Batch
  const [batchName, setBatchName] = useState<string>("");
  const [batchStart, setBatchStart] = useState<string>("");
  const [batchEnd, setBatchEnd] = useState<string>("");
  const [batchCapacity, setBatchCapacity] = useState<number>(20);
  const [batchStatus, setBatchStatus] = useState<BatchStatus>(BatchStatus.Upcoming);

  // Submit Course
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName) return;

    const payload: Partial<Course> = {
      name: courseName,
      duration: courseDuration,
      totalFee: Number(courseFee),
      description: courseDesc,
      status: courseStatus
    };

    const ok = await addCourse(payload);
    if (ok) {
      alert("Academic Course profile created successfully.");
      setIsAddingCourse(false);
      resetCourseForm();
    } else {
      alert("Course creation rejected by database.");
    }
  };

  // Submit Edit Course
  const handleCourseEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const ok = await updateCourse(editingCourse.id, {
      name: editingCourse.name,
      duration: editingCourse.duration,
      totalFee: Number(editingCourse.totalFee),
      description: editingCourse.description,
      status: editingCourse.status
    });

    if (ok) {
      alert("Course profile updated.");
      setEditingCourse(null);
    } else {
      alert("Course update rejected.");
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: string, name: string) => {
    if (currentUser.role !== UserRole.Admin) {
      alert("RESTRICTED: Only administrators can purge records.");
      return;
    }
    const courseStudentsCount = students.filter(s => s.courseId === id).length;
    if (courseStudentsCount > 0) {
      alert(`DENIED: There are currently ${courseStudentsCount} students enrolled under this course. Re-assign or delete those student ledgers before purging course.`);
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete Course: ${name}?`)) {
      const ok = await deleteCourse(id);
      if (ok) {
        alert("Course profile deleted successfully.");
        if (selectedCourseId === id) setSelectedCourseId(null);
      }
    }
  };

  // Reset Course Form
  const resetCourseForm = () => {
    setCourseName("");
    setCourseDuration("3 Months");
    setCourseFee(20000);
    setCourseDesc("");
    setCourseStatus(CourseStatus.Active);
  };

  // Submit Batch
  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName || !selectedCourseId) return;

    const payload: Partial<Batch> = {
      courseId: selectedCourseId,
      name: batchName,
      startDate: batchStart || new Date().toISOString().split("T")[0],
      endDate: batchEnd || new Date().toISOString().split("T")[0],
      capacity: Number(batchCapacity),
      status: batchStatus
    };

    const ok = await addBatch(payload);
    if (ok) {
      alert("Academic batch registered under course successfully.");
      setIsAddingBatch(false);
      resetBatchForm();
    } else {
      alert("Batch registration failed.");
    }
  };

  // Submit Edit Batch
  const handleBatchEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    const ok = await updateBatch(editingBatch.id, {
      name: editingBatch.name,
      startDate: editingBatch.startDate,
      endDate: editingBatch.endDate,
      capacity: Number(editingBatch.capacity),
      status: editingBatch.status
    });

    if (ok) {
      alert("Batch timeline parameters updated.");
      setEditingBatch(null);
    } else {
      alert("Database rejected batch modification.");
    }
  };

  // Delete Batch
  const handleDeleteBatch = async (id: string, name: string) => {
    if (currentUser.role !== UserRole.Admin) {
      alert("RESTRICTED: Admin role required.");
      return;
    }
    const batchStudentsCount = students.filter(s => s.batchId === id).length;
    if (batchStudentsCount > 0) {
      alert(`DENIED: There are ${batchStudentsCount} students assigned to this batch registry. Remove or re-assign students first.`);
      return;
    }
    if (window.confirm(`Confirm purging batch registry: ${name}?`)) {
      const ok = await deleteBatch(id);
      if (ok) {
        alert("Batch record permanently deleted.");
      }
    }
  };

  const resetBatchForm = () => {
    setBatchName("");
    setBatchStart("");
    setBatchEnd("");
    setBatchCapacity(20);
    setBatchStatus(BatchStatus.Upcoming);
  };

  // Pick first course by default if none is selected
  const activeCourseId = selectedCourseId || (courses.length > 0 ? courses[0].id : null);
  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeCourseBatches = activeCourse ? batches.filter(b => b.courseId === activeCourse.id) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="courses-view-root">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Academic course Catalog & Batches</h2>
          <p className="text-[11px] text-slate-400">Configure academic catalog structures, adjust class capacities and schedule batch groups.</p>
        </div>
        <button
          onClick={() => setIsAddingCourse(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/10 flex items-center space-x-1.5 self-start sm:self-auto"
          id="btn-add-course"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Program</span>
        </button>
      </div>

      {/* 2. Main Catalog Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel A: Course Catalog Directory (List of Courses) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Academic Programs</h3>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
              {courses.length} Active Courses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => {
              const isSelected = activeCourseId === course.id;
              const courseStudents = students.filter(s => s.courseId === course.id).length;
              const courseBatchesCount = batches.filter(b => b.courseId === course.id).length;

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`
                    p-5 bg-white border rounded-xl shadow-sm cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-48
                    ${isSelected 
                      ? "border-blue-500 ring-1 ring-blue-500 shadow-blue-500/5 bg-blue-50/5" 
                      : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }
                  `}
                  id={`course-card-${course.id}`}
                >
                  {/* Title and stats */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                        {course.duration} Program
                      </span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase
                        ${course.status === CourseStatus.Active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}
                      `}>
                        {course.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-tight truncate-2-lines">
                      {course.name}
                    </h4>
                    {(course.days || course.classTime) && (
                      <p className="text-[10px] font-mono font-semibold text-emerald-700">
                        {course.classesPerWeek ? `${course.classesPerWeek}/wk · ` : ""}
                        {course.days}
                        {course.classTime ? ` · ${course.classTime}` : ""}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                      {course.description || "No academic overview is logged for this program."}
                    </p>
                  </div>

                  {/* Pricing and Action row */}
                  <div className="flex items-end justify-between border-t border-slate-100 pt-3.5 mt-auto">
                    <div>
                      <p className="text-[9px] font-semibold font-mono text-slate-400 uppercase">Standard Tuition Fee</p>
                      <p className="text-xs font-bold font-mono text-slate-800">{course.totalFee.toLocaleString()} PKR</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingCourse(course); }}
                        className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded"
                        title="Configure properties"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                      </button>
                      {currentUser.role === UserRole.Admin && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id, course.name); }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Purge program"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel B: Associated Academic Batches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Academic Batches</h3>
            {activeCourse && (
              <button
                onClick={() => setIsAddingBatch(true)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[10px] rounded flex items-center space-x-1"
                id="btn-add-batch"
              >
                <Plus className="w-3 h-3" />
                <span>Assign Batch</span>
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 min-h-64">
            {activeCourse ? (
              <div className="space-y-4">
                {/* Active Course metadata */}
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Batch Directory for:</h4>
                  <p className="text-xs font-bold text-blue-600 mt-1">{activeCourse.name}</p>
                </div>

                {activeCourseBatches.length === 0 ? (
                  <p className="text-xs text-slate-400 py-12 text-center">No batches have been registered for this program yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activeCourseBatches.map(batch => {
                      const batchStudentsCount = students.filter(s => s.batchId === batch.id).length;
                      return (
                        <div key={batch.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="text-xs font-bold text-slate-800 font-mono">{batch.name}</h5>
                              <p className="text-[10px] text-slate-400 mt-0.5">ID: {batch.id}</p>
                            </div>
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase
                              ${batch.status === BatchStatus.Active ? "bg-green-100 text-green-800" : ""}
                              ${batch.status === BatchStatus.Completed ? "bg-blue-100 text-blue-800" : ""}
                              ${batch.status === BatchStatus.Upcoming ? "bg-amber-100 text-amber-800" : ""}
                            `}>
                              {batch.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-500 border-t border-slate-100 pt-2 font-sans">
                            <div>
                              <p className="text-slate-400">Class Start</p>
                              <p className="text-slate-700 font-semibold mt-0.5">{batch.startDate}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Class End</p>
                              <p className="text-slate-700 font-semibold mt-0.5">{batch.endDate}</p>
                            </div>
                            <div className="col-span-2 flex items-center justify-between border-t border-slate-100/60 pt-1.5 mt-1">
                              <span className="flex items-center text-slate-400">
                                <Users className="w-3 h-3 mr-1" /> Size: {batchStudentsCount} / {batch.capacity}
                              </span>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => setEditingBatch(batch)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline text-[9px] font-bold"
                                >
                                  Modify
                                </button>
                                {currentUser.role === UserRole.Admin && (
                                  <button
                                    onClick={() => handleDeleteBatch(batch.id, batch.name)}
                                    className="text-red-600 hover:text-red-800 hover:underline text-[9px] font-bold pl-1.5"
                                  >
                                    Purge
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">Register a course catalog item in the panel to enable batch assignments.</p>
            )}
          </div>
        </div>

      </div>

      {/* 3. MODAL: Adding Course */}
      {isAddingCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="add-course-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Create New Academic Program</h3>
              <button onClick={() => setIsAddingCourse(false)} className="text-slate-400 hover:text-slate-800 text-xs font-semibold">Close</button>
            </div>
            <form onSubmit={handleCourseSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Course Name *</label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Course name"
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Standard Duration *</label>
                  <select
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="4 Months">4 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tuition Fee (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={courseFee}
                    onChange={(e) => setCourseFee(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Syllabus Overview & Description</label>
                <textarea
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Summarize course content guidelines and professional career outcomes..."
                  className="w-full p-2.5 border border-slate-200 rounded h-20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Program Status</label>
                <select
                  value={courseStatus}
                  onChange={(e) => setCourseStatus(e.target.value as CourseStatus)}
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                >
                  <option value={CourseStatus.Active}>Active</option>
                  <option value={CourseStatus.Inactive}>Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-1.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingCourse(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
                  id="btn-add-course-confirm"
                >
                  Confirm Create
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: Editing Course */}
      {editingCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="edit-course-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Configure Program Parameters</h3>
              <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-slate-800 text-xs font-semibold">Close</button>
            </div>
            <form onSubmit={handleCourseEditSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Course Name</label>
                <input
                  type="text"
                  required
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Standard Duration</label>
                  <select
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="4 Months">4 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tuition Fee (PKR)</label>
                  <input
                    type="number"
                    required
                    value={editingCourse.totalFee}
                    onChange={(e) => setEditingCourse({ ...editingCourse, totalFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Syllabus overview</label>
                <textarea
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded h-20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Program Catalog Status</label>
                <select
                  value={editingCourse.status}
                  onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-1.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
                  id="btn-edit-course-confirm"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Adding Batch */}
      {isAddingBatch && activeCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="add-batch-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Assign New Batch</h3>
                <p className="text-[10px] text-blue-600 font-bold font-sans mt-0.5">{activeCourse.name}</p>
              </div>
              <button onClick={() => setIsAddingBatch(false)} className="text-slate-400 hover:text-slate-800 text-xs font-semibold">Close</button>
            </div>
            <form onSubmit={handleBatchSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Batch Identification Name *</label>
                <input
                  type="text"
                  required
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="e.g. FSWD-2026-BatchC"
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Batch Start Date *</label>
                  <input
                    type="date"
                    required
                    value={batchStart}
                    onChange={(e) => setBatchStart(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Batch expected End Date *</label>
                  <input
                    type="date"
                    required
                    value={batchEnd}
                    onChange={(e) => setBatchEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Maximum Capacity (Seats) *</label>
                  <input
                    type="number"
                    required
                    value={batchCapacity}
                    onChange={(e) => setBatchCapacity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Commencement Status</label>
                  <select
                    value={batchStatus}
                    onChange={(e) => setBatchStatus(e.target.value as BatchStatus)}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value={BatchStatus.Upcoming}>Upcoming / Preparing</option>
                    <option value={BatchStatus.Active}>Active / Running</option>
                    <option value={BatchStatus.Completed}>Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-1.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingBatch(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
                  id="btn-add-batch-confirm"
                >
                  Register Batch
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: Editing Batch */}
      {editingBatch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="edit-batch-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Configure Batch timelines</h3>
              <button onClick={() => setEditingBatch(null)} className="text-slate-400 hover:text-slate-800 text-xs font-semibold">Close</button>
            </div>
            <form onSubmit={handleBatchEditSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Batch Identification Name</label>
                <input
                  type="text"
                  required
                  value={editingBatch.name}
                  onChange={(e) => setEditingBatch({ ...editingBatch, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Commenced Date</label>
                  <input
                    type="date"
                    required
                    value={editingBatch.startDate}
                    onChange={(e) => setEditingBatch({ ...editingBatch, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">expected End Date</label>
                  <input
                    type="date"
                    required
                    value={editingBatch.endDate}
                    onChange={(e) => setEditingBatch({ ...editingBatch, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Total Capacity (Seats)</label>
                  <input
                    type="number"
                    required
                    value={editingBatch.capacity}
                    onChange={(e) => setEditingBatch({ ...editingBatch, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Academic Status</label>
                  <select
                    value={editingBatch.status}
                    onChange={(e) => setEditingBatch({ ...editingBatch, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-1.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
                  id="btn-edit-batch-confirm"
                >
                  Save Timelines
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
