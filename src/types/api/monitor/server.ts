// @/types/api/monitor/server.ts

/** CPU 信息 */
export interface Cpu {
    /** CPU型号 */
    cpuModel?: string;
    /** 核心数 */
    cpuNum?: number;
    /** CPU总的使用率 */
    total?: number;
    /** CPU系统使用率 */
    sys?: number;
    /** CPU用户使用率 */
    used?: number;
    /** CPU当前等待率 */
    wait?: number;
    /** CPU当前空闲率 */
    free?: number;
}

/** 内存信息 */
export interface Mem {
    /** 内存总数 */
    total?: number;
    /** 已用内存 */
    used?: number;
    /** 剩余内存 */
    free?: number;
    /** 内存使用率 */
    usage?: number;
}

/** JVM 信息 */
export interface Jvm {
    /** JVM 最大可用内存总数 */
    max?: number;
    /** JVM 占用的内存总数 */
    total?: number;
    /** JVM 已用内存 */
    used?: number;
    /** JVM 空闲内存 */
    free?: number;
    /** JVM 内存使用率 */
    usage?: number;
    /** JVM 名称 */
    name?: string;
    /** Java Version */
    version?: string;
    /** JavaVM Vendor */
    vendor?: string;
    /** JDK 路径 */
    home?: string;
    /** JarDir */
    userDir?: string;
    /** JVM 启动时间 */
    startTime?: string;
    /** JVM 运行时间 */
    runTime?: string;
    /** JVM InputArguments */
    inputArguments?: string[];
}

/** 系统信息 */
export interface Sys {
    /** 操作系统 */
    osName?: string;
    /** 系统架构 */
    osArch?: string;
    /** 系统版本 */
    osVersion?: string;
    /** 服务器名称 */
    computerName?: string;
    /** 服务器Ip */
    computerIp?: string;
}

/** 磁盘信息 */
export interface Disk {
    /** 磁盘名称 */
    diskName?: string;
    /** 磁盘类型 */
    diskType?: string;
    /** 磁盘路径 */
    dirName?: string;
    /** 总大小 */
    total?: string;
    /** 剩余大小 */
    free?: string;
    /** 已经使用量 */
    used?: string;
    /** 资源的使用率 */
    usage?: number;
}

/** 服务器信息（聚合） */
export interface Server {
    /** CPU信息 */
    cpu?: Cpu;
    /** 内存信息 */
    mem?: Mem;
    /** JVM信息 */
    jvm?: Jvm;
    /** 系统信息 */
    sys?: Sys;
    /** 系统文件信息 */
    disks?: Disk[];
}
