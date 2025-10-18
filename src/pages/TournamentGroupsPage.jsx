import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Plus, Edit, Trash2, FolderOpen, UserPlus, X } from 'lucide-react';
import { groupsAPI, teamsAPI } from '../services/api';
import { useRole } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TournamentGroupsPage() {
  const { id } = useParams(); // Tournament ID
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [teams, setTeams] = useState([]);
  const [ungroupedTeams, setUngroupedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({ groupName: '', teamIds: [] });
  
  const { canCreate, canEdit, canDelete } = useRole();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch groups
      const groupsResponse = await groupsAPI.getAll(id);
      setGroups(groupsResponse.data || []);
      
      // Fetch teams
      const teamsResponse = await teamsAPI.getAll(id);
      const allTeams = teamsResponse.data || [];
      setTeams(allTeams);
      
      // Filter ungrouped teams
      const ungrouped = allTeams.filter(team => !team.groupId);
      setUngroupedTeams(ungrouped);
      
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!formData.groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    try {
      await groupsAPI.create({
        tournamentId: id,
        groupName: formData.groupName,
        teamIds: formData.teamIds
      });
      
      setFormData({ groupName: '', teamIds: [] });
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to create group: ' + err.message);
    }
  };

  const handleUpdateGroup = async () => {
    if (!formData.groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    try {
      await groupsAPI.update(editingGroup.groupId, {
        groupName: formData.groupName,
        teamIds: formData.teamIds
      });
      
      setFormData({ groupName: '', teamIds: [] });
      setEditingGroup(null);
      fetchData();
    } catch (err) {
      alert('Failed to update group: ' + err.message);
    }
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (!confirm(`Are you sure you want to delete "${groupName}"? Teams will remain but be ungrouped.`)) return;

    try {
      await groupsAPI.delete(groupId);
      fetchData();
    } catch (err) {
      alert('Failed to delete group: ' + err.message);
    }
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName,
      teamIds: group.teamIds || []
    });
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setEditingGroup(null);
    setFormData({ groupName: '', teamIds: [] });
  };

  const toggleTeamSelection = (teamId) => {
    setFormData(prev => ({
      ...prev,
      teamIds: prev.teamIds.includes(teamId)
        ? prev.teamIds.filter(id => id !== teamId)
        : [...prev.teamIds, teamId]
    }));
  };

  const getTeamsForGroup = (groupId) => {
    return teams.filter(team => team.groupId === groupId);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Groups
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            {canCreate ? 'Organize teams into groups' : 'View team groups'}
          </p>
        </div>
        {canCreate && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all font-semibold touch-manipulation active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Group</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Groups List */}
      {groups.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No groups yet</h3>
          <p className="text-slate-500 mb-4 text-sm px-4">
            {canCreate ? 'Create your first group to organize teams' : 'No groups available'}
          </p>
          {canCreate && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors touch-manipulation active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(group => {
            const groupTeams = getTeamsForGroup(group.groupId);
            
            return (
              <div 
                key={group.groupId}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-white/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-lg">{group.groupName}</h3>
                      <p className="text-sm text-slate-600">{groupTeams.length} teams</p>
                    </div>
                  </div>
                  
                  {(canEdit || canDelete) && (
                    <div className="flex gap-2">
                      {canEdit && (
                        <button
                          onClick={() => openEditModal(group)}
                          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit group"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteGroup(group.groupId, group.groupName)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete group"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Teams in Group */}
                {groupTeams.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupTeams.map(team => (
                      <div 
                        key={team.teamId}
                        className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <span className="font-semibold text-slate-800 text-sm">{team.teamName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm">No teams in this group yet</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ungrouped Teams */}
      {ungroupedTeams.length > 0 && (
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-white/20">
          <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Ungrouped Teams ({ungroupedTeams.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ungroupedTeams.map(team => (
              <div 
                key={team.teamId}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold text-slate-800 text-sm">{team.teamName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingGroup) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">
                  {editingGroup ? 'Edit Group' : 'Create Group'}
                </h3>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Group Name */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
                  placeholder="e.g., Group A, Pool 1"
                />
              </div>

              {/* Team Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Select Teams
                </label>
                
                {teams.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm">No teams available in this tournament</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {teams.map(team => {
                      const isSelected = formData.teamIds.includes(team.teamId);
                      const isInOtherGroup = team.groupId && team.groupId !== editingGroup?.groupId;
                      
                      return (
                        <button
                          key={team.teamId}
                          onClick={() => !isInOtherGroup && toggleTeamSelection(team.teamId)}
                          disabled={isInOtherGroup}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500'
                              : isInOtherGroup
                              ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                              : 'bg-white border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-slate-800 truncate block">
                                {team.teamName}
                              </span>
                              {isInOtherGroup && (
                                <span className="text-xs text-slate-500">
                                  Already in {team.groupName}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                
                <p className="text-sm text-slate-500 mt-2">
                  Selected: {formData.teamIds.length} team{formData.teamIds.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
                >
                  {editingGroup ? 'Update Group' : 'Create Group'}
                </button>
                <button
                  onClick={closeModals}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}