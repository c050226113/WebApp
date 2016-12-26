/**
 * mongo key
 * */
const USER_DEVICES = 'devices';
const USER_PASSWORD = 'pwd';
const USER_USING = 'using';
const USER_HASDEVICES = 'hasdevices';
const USER_NAME = 'username';
const USER_AVT = 'useravt';
/**
 * devices info
 */
const DEVICE_INFO = 'info';
const DEVICE_IMEI = 'a';
const DEVICE_NUM = 'b';
const DEVICE_NAME = 'c';
const DEVICE_AVT = 'd';
const DEVICE_SCHOOL = 'e';
const DEVICE_POWER = 'f';
const DEVICE_STEPS = 'g';
const DEVICE_LAT = 'h';
const DEVICE_LON = 'i';
const DEVICE_LOCATIONTYPE = 'j';
const DEVICE_LOCATIONTYPE_GSM = 'a';
const DEVICE_LOCATIONTYPE_WIFI = 'b';
const DEVICE_LOCATIONTYPE_GPS = 'c';
const DEVICE_RADIUS = 'k';
const DEVICE_LOCATION_TYPE = 'l';
const DEVICE_LOCATION_INSAVE = 'a';
const DEVICE_LOCATION_INDANGER = 'b';
const DEVICE_LOCATION_OUT = 'c';
const DEVICE_SEX = 'r';
const DEVICE_BIRTH = 's';
const DEVICE_ID = 't';
const DEVICE_HU = 'u';
const DEVICE_TYPE = 'v';
const DEVICE_CLASS = 'w';
const DEVICE_FACE = 'x';
const DEVICE_SCHOOLWAY = 'y';
const DEVICE_LIVE = 'z';
/**
 * devices family
 */
const DEVICE_FAMILY = 'family';
const FAMILY_PHONE = 'a';
const FAMILY_NAME = 'b';
/**
 * devices setting
 */
const DEVICE_SETTING = 'setting';
const SETTING_CLASS = 'a';
const SETTING_CLASS_STATUS = 'a';
const SETTING_CLASS_WEEK = 'b';
const SETTING_CLASS_STARTH = 'c';
const SETTING_CLASS_STARTM = 'd';
const SETTING_CLASS_ENDH = 'e';
const SETTING_CLASS_ENDM = 'f';
const SETTING_INTERVALSHUTDOWN = 'b';
const SETTING_INTERVALSHUTDOWN_STATUS = 'a';
const SETTING_INTERVALSHUTDOWN_TIMEH = 'b';
const SETTING_INTERVALSHUTDOWN_TIMEM = 'c';
const SETTING_SYS = 'c';
const SETTING_CONTROL = 'd';
const SETTING_REMOVE_BIND = 'e';
const SETTING_BACKUP = 'f';
/**
 * devices fence
 */
const DEVICE_FENCE = 'fence';
const FENCE_LAT = 'a';
const FENCE_LON = 'b';
const FENCE_RADIUS = 'c';
const FENCE_NAME = 'd';
const FENCE_STATUS = 'e';
const FENCE_ISDANGER = 'f';
/**
 * devices waypoint
 */
const DEVICE_WAYPOINT = 'waypoint';
const WAYPOINT_INTTIME = 'a';
const WAYPOINT_POINTS = 'b';
const WAYPOINT_UTCTIME = 'c';
const WAYPOINT_UPLOAD_TIME = 'd';
/**
 * devices events
 */
const DEVICE_EVENT = 'events';
const DEVICE_EVENT_STATUS = 'a';
const DEVICE_EVENT_TYPE = 'b';
const DEVICE_EVENT_TYPE_MESSAGE = 'a';
const DEVICE_EVENT_TYPE_POSITIONWARNING = 'b';
const DEVICE_EVENT_TYPE_SOS = 'c';
const DEVICE_EVENT_TYPE_SOS_BTN = 'a';
const DEVICE_EVENT_TYPE_SOS_FALL = 'b';
const DEVICE_EVENT_TYPE_SOS_HEART_RATE = 'c';
const DEVICE_EVENT_TYPE_SOS_SIGN = 'd';
const DEVICE_EVENT_MESSAGE = 'c';
const DEVICE_EVENT_ISRECIEVE = 'd';
const DEVICE_EVENT_INTTIME = 'e';
const DEVICE_EVENT_UTCTIME = 'f';
const DEVICE_EVENT_HAS_READ = 'g';

/**
 * devices sports
 */
const DEVICE_SPORTS = 'sports';
const DEVICE_SPORTS_INTTIME = 'a';
const DEVICE_SPORTS_POWER = 'b';
const DEVICE_SPORTS_STEPS = 'c';
const DEVICE_SPORTS_UTCTIME = 'd';
const DEVICE_SPORTS_CHARGE_STATUS = 'e';
const DEVICE_SPORTS_SIGNAL = 'f';
const DEVICE_SPORTS_IS_WEAR = 'g';
/**
 * devices family
 */
const DEVICE_PRE_FAMILY = 'family';
const DEVICE_PRE_FAMILY_INTTIME = 'a';
const DEVICE_PRE_FAMILY_LIST = 'b';
const DEVICE_PRE_FAMILY_LIST_NAME = 'a';
const DEVICE_PRE_FAMILY_LIST_PHONE = 'b';
/**
 * devices healthy
 */
const DEVICE_HEALTHY = 'healthy';
const DEVICE_HEALTHY_HEART_RATE = 'a';
const DEVICE_HEALTHY_UPLOAD_TIME = 'b';


TCP_CLIENT = {
    1:'设备不在线',
    2:'数据包解析错误',
    3:'数据包解析错误',
    4:'权限不足'
};