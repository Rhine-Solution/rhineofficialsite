'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const dashboardStats = [
  { label: 'Total Orders', value: '12', icon: '📦' },
  { label: 'Appointments', value: '3', icon: '📅' },
  { label: 'Messages', value: '5', icon: '💬' },
  { label: 'Files Uploaded', value: '8', icon: '📁' },
]

const recentOrders = [
  { id: '1', date: '2026-04-15', status: 'Delivered', total: 149.99 },
  { id: '2', date: '2026-04-10', status: 'Processing', total: 89.99 },
  { id: '3', date: '2026-04-05', status: 'Shipped', total: 299.99 },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-zinc-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-zinc-400">Manage your account and activity</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardStats.map(stat => (
              <Card key={stat.label}>
                <CardContent className="text-center p-6">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Orders */}
              <Card>
                <CardContent>
                  <div className="flex justify-between items-center mb-6">
                    <CardTitle>Recent Orders</CardTitle>
                    <Link href="/dashboard/orders">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-zinc-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-cyan-400 font-semibold mt-1">${order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent>
                  <CardTitle className="mb-4">Quick Actions</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/shop">
                      <Button variant="outline" className="w-full">🛒 Shop Now</Button>
                    </Link>
                    <Link href="/travel">
                      <Button variant="outline" className="w-full">✈️ Book Travel</Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full">💬 Send Message</Button>
                    </Link>
                    <Link href="/portfolio">
                      <Button variant="outline" className="w-full">💼 View Portfolio</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-indigo-500 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-4">
                      R
                    </div>
                    <h3 className="font-semibold">Rhine User</h3>
                    <p className="text-sm text-zinc-500">user@example.com</p>
                    <Button className="w-full mt-4" variant="outline">Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card>
                <CardContent>
                  <CardTitle className="mb-4">Upcoming</CardTitle>
                  <div className="space-y-3">
                    <div className="p-3 bg-zinc-900 rounded-lg">
                      <p className="text-sm font-medium">Consultation</p>
                      <p className="text-xs text-zinc-500">Apr 20, 2026 • 2:00 PM</p>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-lg">
                      <p className="text-sm font-medium">Review Meeting</p>
                      <p className="text-xs text-zinc-500">Apr 25, 2026 • 10:00 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card>
                <CardContent>
                  <CardTitle className="mb-4">File Upload</CardTitle>
                  <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
                    <p className="text-zinc-500 text-sm mb-4">Drag & drop files here</p>
                    <Button variant="outline" size="sm">Choose Files</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}