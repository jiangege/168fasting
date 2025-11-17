/**
 * 格式化时间戳为易读格式
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串，如 "11月17日 14:30"
 */
export function formatTime(timestamp) {
  const d = new Date(timestamp)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/**
 * 格式化小时数为时长显示
 * @param {number} hours - 小时数
 * @returns {string} 格式化后的时长，如 "15小时30分"
 */
export function formatDuration(hours) {
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  if (h === 0) {
    return `${m}分钟`
  }
  if (m === 0) {
    return `${h}小时`
  }
  return `${h}小时${m}分钟`
}

/**
 * 格式化倒计时（毫秒）为 HH:MM 格式
 * @param {number} milliseconds - 毫秒数
 * @returns {string} 格式化后的倒计时，如 "01:30"
 */
export function formatCountdown(milliseconds) {
  const totalMinutes = Math.floor(milliseconds / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * 计算进度百分比
 * @param {number} start - 开始时间戳
 * @param {number} current - 当前时间戳
 * @param {number} target - 目标时长（小时）
 * @returns {number} 进度百分比 (0-100)
 */
export function calculateProgress(start, current, target) {
  const elapsed = (current - start) / 3600000 // 转换为小时
  const progress = (elapsed / target) * 100
  return Math.min(progress, 100)
}

