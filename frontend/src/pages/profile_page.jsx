import { useState } from "react";
import ProfileView from "../components/profile_view";
import { useDispatch, useSelector } from "react-redux";
import { reset_auth_state, update_profile } from "../store/slices/auth_slice";

function ProfilePage() {
  const dispatch = useDispatch();
  const {
    user,
    error: authError,
    success_msg,
  } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.tasks);

  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfileSubmit = async (e) => {
    if (e) e.preventDefault();
    const result = await dispatch(update_profile(profileData));

    if (update_profile.fulfilled.match(result)) {
      setTimeout(() => {
        setShowProfileModal(false);
        dispatch(reset_auth_state());
      }, 2500);
    }
  };

  const openProfileEdit = () => {
    dispatch(reset_auth_state());
    setProfileData({ name: user.name, email: user.email });
    setShowProfileModal(true);
  };

  if (!user) return null;

  return (
    <>
      <main className="flex-1 ml-64 p-12">
        <ProfileView
          user={user}
          taskCount={items.length}
          onEditClick={openProfileEdit}
        />
      </main>
      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                Edit Account
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-4 hover:bg-white rounded-[24px] text-slate-300 hover:text-rose-500 transition-all active:scale-90"
              >
                <X size={28} strokeWidth={3} />
              </button>
            </div>

            {/* CHANGED FROM <form> TO <div> TO PREVENT ANY POSSIBLE RELOAD */}
            <div className="p-10 space-y-8">
              {/* SUCCESS MESSAGE */}
              {success_msg && (
                <div className="flex items-center gap-3 p-5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-[24px] animate-in slide-in-from-top-4 duration-300">
                  <CheckCircle2 size={22} strokeWidth={3} />
                  <p className="font-black text-sm tracking-tight">
                    {success_msg}
                  </p>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {authError && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl">
                  <AlertCircle size={20} />{" "}
                  <p className="text-sm font-bold">{authError}</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Full Name
                </label>
                <input
                  required
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 text-lg"
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Email Address
                </label>
                <input
                  required
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 text-lg"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>

              <button
                type="button"
                onClick={handleProfileSubmit}
                className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black hover:bg-indigo-600 transition-all shadow-2xl active:scale-[0.98] text-xl mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePage;
