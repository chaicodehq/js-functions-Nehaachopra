/**
 * 🎉 Festival Countdown Planner - Module Pattern
 *
 * Indian festivals ka planner bana! Module pattern use karna hai —
 * matlab ek function jo ek object return kare jisme public methods hain,
 * lekin andar ka data PRIVATE rahe (bahar se directly access na ho sake).
 *
 * Function: createFestivalManager()
 *
 * Returns an object with these PUBLIC methods:
 *
 *   - addFestival(name, date, type)
 *     date is "YYYY-MM-DD" string, type is "religious"/"national"/"cultural"
 *     Returns new total count of festivals
 *     Agar name empty or date not string or invalid type, return -1
 *     No duplicate names allowed (return -1 if exists)
 *
 *   - removeFestival(name)
 *     Returns true if removed, false if not found
 *
 *   - getAll()
 *     Returns COPY of all festivals array (not the actual private array!)
 *     Each festival: { name, date, type }
 *
 *   - getByType(type)
 *     Returns filtered array of festivals matching type
 *
 *   - getUpcoming(currentDate, n = 3)
 *     currentDate is "YYYY-MM-DD" string
 *     Returns next n festivals that have date >= currentDate
 *     Sorted by date ascending
 *
 *   - getCount()
 *     Returns total number of festivals
 *
 * PRIVATE STATE: festivals array should NOT be accessible from outside.
 *   manager.festivals should be undefined.
 *   getAll() must return a COPY so modifying it doesn't affect internal state.
 *   Two managers should be completely independent.
 *
 * Hint: This is the Module Pattern — a function that returns an object
 *   of methods, all closing over shared private variables.
 *
 * @example
 *   const mgr = createFestivalManager();
 *   mgr.addFestival("Diwali", "2025-10-20", "religious");   // => 1
 *   mgr.addFestival("Republic Day", "2025-01-26", "national"); // => 2
 *   mgr.getAll(); // => [{ name: "Diwali", ... }, { name: "Republic Day", ... }]
 *   mgr.getUpcoming("2025-01-01", 1); // => [{ name: "Republic Day", ... }]
 */
export function createFestivalManager() {
  // Your code here
  let festivals = [];

  return {
    addFestival: (name, date, type) => {
      const types = ["religious", "national", "cultural"]
      if (typeof name !== "string" || name.trim() === "" || date.trim() === "" || typeof date !== "string" || typeof type !== "string" || type.trim() === "" || !types.includes(type)) return -1

      if (festivals.find(festival => festival.name === name))return -1;
      festivals.push({name, date,type});
      return festivals.length;
    },
    removeFestival: (name) => {
      if (typeof name !== "string" || name.trim() === "") return false;

      const index = festivals.findIndex(festival => festival.name === name);
      if (index !== -1) {
        festivals.splice(index, 1);
        return true
      }
      
      return false;
    },
    getAll: () => {
      return [...festivals]
    },
    getByType: (type) => {
      if (typeof type !== "string" || type.trim() === "") return -1;
      return festivals.filter(festival => festival.type === type)
    },
    getCount: () => {
      return festivals.length;
    },
    getUpcoming: (currentDate, n = 3) => {
      if (typeof currentDate !== "string" || currentDate.trim() === "" || !Number.isInteger(n) || n < 1) return [];

      const current = new Date(currentDate)
      return festivals
            .filter(festival => new Date(festival.date) >= current)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, n);
    }
  }
}
