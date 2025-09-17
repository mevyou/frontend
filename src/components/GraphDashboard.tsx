'use client';

import { useDashboardData, formatTimestamp, formatBlockNumber } from '@/hooks/useGraphData';
import { Loader2, Users, UserX, Edit, Trophy, Calendar, Hash } from 'lucide-react';
import Image from 'next/image';

export function GraphDashboard() {
  const { data, isLoading, error, refetch } = useDashboardData(5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-400">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Failed to load dashboard data</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-400">New Users</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {data.userCreateds.length}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-400">Total Bets</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {data.betCreateds.length}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Edit className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-400">Profile Updates</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {data.updatedProfiles.length}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserX className="h-5 w-5 text-red-500" />
            <span className="text-sm text-gray-400">Deleted Profiles</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {data.deletedProfiles.length}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Recent Users
          </h3>
          <div className="space-y-3">
            {data.userCreateds.slice(0, 5).map((user) => (
              <div key={user.id} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-white">{user.profile_name || user.username}</div>
                    <div className="text-sm text-gray-400 font-mono">
                      {user.user.slice(0, 6)}...{user.user.slice(-4)}
                    </div>
                    {user.profile_description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {user.profile_description}
                      </div>
                    )}
                  </div>
                  {user.profile_image && (
                    <div className="ml-3">
                      <Image
                        src={user.profile_image}
                        alt={user.profile_name || user.username}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimestamp(user.blockTimestamp)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {formatBlockNumber(user.blockNumber)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bets */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-500" />
            Recent Bets
          </h3>
          <div className="space-y-3">
            {data.betCreateds.slice(0, 5).map((bet) => (
              <div key={bet.id} className="p-3 bg-gray-700 rounded-lg">
                <div className="font-medium text-white mb-1">{bet.bet_name}</div>
                <div className="text-sm text-gray-400 mb-2">{bet.bet_description}</div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Status: {bet.bet_status}</span>
                  <span>{formatTimestamp(bet.bet_createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Updates */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Edit className="h-5 w-5 text-yellow-500" />
          Recent Profile Updates
        </h3>
        <div className="space-y-3">
          {data.updatedProfiles.slice(0, 5).map((profile) => (
            <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-white">{profile.param1_name}</div>
                <div className="text-sm text-gray-400 font-mono">
                  {profile.param1_user.slice(0, 6)}...{profile.param1_user.slice(-4)}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {formatTimestamp(profile.param0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deleted Profiles */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <UserX className="h-5 w-5 text-red-500" />
          Recently Deleted Profiles
        </h3>
        <div className="space-y-3">
          {data.deletedProfiles.slice(0, 5).map((profile) => (
            <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-white font-mono">
                  {profile.owner.slice(0, 6)}...{profile.owner.slice(-4)}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatTimestamp(profile.blockTimestamp)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Hash className="h-3 w-3" />
                  {formatBlockNumber(profile.blockNumber)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
