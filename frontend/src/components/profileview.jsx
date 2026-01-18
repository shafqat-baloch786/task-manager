import React from 'react';
import { User, Shield, Mail, Calendar, Pencil, CheckCircle } from 'lucide-react';

const ProfileView = ({ user, taskCount, onEditClick }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">My Profile</h1>
        <p className="text-slate-500 text-lg font-medium">Manage your personal information and account security.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <div className="w-32 h-32 bg-indigo-50 rounded-[32px] mx-auto mb-6 flex items-center justify-center text-indigo-600 border-4 border-white shadow-xl">
              <User size={50} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1 leading-tight">{user.name}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">Member</p>
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <CheckCircle size={12} /> Verified
            </span>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-sm uppercase tracking-widest mb-2 opacity-80">Total Tasks</h4>
            <p className="text-5xl font-black">{taskCount}</p>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="md:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3">
            <Shield className="text-indigo-600" size={24} /> Account Information
          </h3>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                  <User size={14} /> Full Name
                </label>
                <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 font-bold text-slate-700">
                  {user.name}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                  <Mail size={14} /> Email Address
                </label>
                <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 font-bold text-slate-700 lowercase">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <Calendar size={14} /> Member Since
              </label>
              <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 font-bold text-slate-700">
                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
                  month: 'long', day: 'numeric', year: 'numeric' 
                })}
              </div>
            </div>

            <div className="pt-6">
              {/* Added type="button" to prevent default form behavior */}
              <button 
                type="button"
                onClick={onEditClick}
                className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[28px] font-black hover:bg-indigo-600 transition-all active:scale-95 shadow-lg"
              >
                <Pencil size={20} /> Edit Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;