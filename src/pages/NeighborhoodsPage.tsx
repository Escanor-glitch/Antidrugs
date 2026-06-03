import { MapPin, Users, Building, Settings, Edit, Trash2 } from 'lucide-react';
import { neighborhoods, sectors, volunteers } from '../data';

export default function NeighborhoodsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">إدارة الأحياء</h2>
        <p className="text-gray-500 text-sm mt-0.5">إدارة أحياء الإسكندرية والمنسقين الخاصين بها</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {neighborhoods.map(neighborhood => {
          const sector = sectors.find(s => s.id === neighborhood.sectorId);
          const neighborhoodVols = volunteers.filter(v => v.neighborhoodId === neighborhood.id);
          return (
            <div key={neighborhood.id} className="card hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    {neighborhood.name}
                  </h3>
                  {sector && (
                    <p className="text-gray-500 text-sm mt-1">
                      <span className="font-semibold text-teal-700">{sector.name}</span>
                    </p>
                  )}
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
                {/* Coordinator */}
                <div className="flex items-center gap-2 bg-teal-50 rounded-xl p-3">
                  <div className="w-8 h-8 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">منسق الحي</p>
                    <p className="text-gray-800 font-semibold text-sm">{neighborhood.coordinatorName}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-600">{neighborhoodVols.length}</p>
                    <p className="text-gray-500 text-xs">متطوع</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <Building className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-600">{neighborhood.population.toLocaleString('ar-EG')}</p>
                    <p className="text-gray-500 text-xs">السكان</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <MapPin className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-amber-600">{neighborhood.area}</p>
                    <p className="text-gray-500 text-xs">الموقع</p>
                  </div>
                </div>

                {/* Volunteers */}
                <div>
                  <p className="text-gray-600 text-xs font-semibold mb-2">المتطوعون النشطون ({neighborhoodVols.length})</p>
                  {neighborhoodVols.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-2">لا يوجد متطوعون مسجلون</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {neighborhoodVols.slice(0, 3).map(vol => (
                        <img
                          key={vol.id}
                          src={vol.avatar}
                          alt={vol.name}
                          title={vol.name}
                          className="w-7 h-7 rounded-full object-cover border-2 border-white"
                        />
                      ))}
                      {neighborhoodVols.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700 border-2 border-white">
                          +{neighborhoodVols.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="card bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">إجمالي الأحياء</p>
            <p className="text-3xl font-bold text-teal-700 mt-1">{neighborhoods.length}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">إجمالي المتطوعين</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{volunteers.length}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">متوسط السكان</p>
            <p className="text-3xl font-bold text-green-700 mt-1">
              {Math.round(neighborhoods.reduce((s, n) => s + n.population, 0) / neighborhoods.length).toLocaleString('ar-EG')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
