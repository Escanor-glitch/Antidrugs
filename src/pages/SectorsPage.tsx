import { MapPin, Users, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { sectors, neighborhoods } from '../data';

export default function SectorsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">إدارة القطاعات</h2>
        <p className="text-gray-500 text-sm mt-0.5">إدارة قطاعات صندوق الإسكندرية لمكافحة المخدرات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sectors.map(sector => {
          const sectorNeighborhoods = neighborhoods.filter(n => n.sectorId === sector.id);
          return (
            <div key={sector.id} className="card hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{sector.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{sector.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-teal-700">م</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">مدير القطاع</p>
                    <p className="text-gray-800 font-semibold">{sector.managerName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-teal-700">{sector.volunteersCount}</p>
                    <p className="text-gray-500 text-xs">متطوع</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{sectorNeighborhoods.length}</p>
                    <p className="text-gray-500 text-xs">حي</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-amber-600">{sector.eventsCount}</p>
                    <p className="text-gray-500 text-xs">فعالية</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-2 font-semibold">الأحياء التابعة:</p>
                  <div className="space-y-1.5">
                    {sectorNeighborhoods.map(neighborhood => (
                      <div key={neighborhood.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{neighborhood.name}</span>
                        <span className="text-xs text-gray-500 ml-auto flex-shrink-0">
                          {neighborhood.volunteersCount} متطوع
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="card bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">ملخص القطاعات</h3>
            <p className="text-gray-600 text-sm mt-1">
              إجمالي: {sectors.length} قطاع · {sectors.reduce((s, c) => s + c.volunteersCount, 0)} متطوع · {neighborhoods.length} حي
            </p>
          </div>
          <div className="text-teal-700 text-3xl font-bold">{sectors.length}</div>
        </div>
      </div>
    </div>
  );
}
