// src/hooks/useTableSelection.ts
import { ref, Ref, nextTick } from 'vue'

export interface ITableSelectionOptions {
    // 数据列表（当前页数据） - 允许 dataList 本身是 undefined
    dataList?: Ref<any[] | undefined> | Ref<any[]>
    // 主键字段名
    primaryKey?: string
    // 表格实例引用（用于 toggleRowSelection）
    tableRef?: Ref<any>
}

/**
 * 独立的表格多选 Composable
 * 职责：管理跨页多选状态，维护已选数据列表
 */
export const useTableSelection = (options: ITableSelectionOptions) => {
    const { dataList, primaryKey = 'id', tableRef } = options

    // 已选中的数据列表（跨页存储）
    const dataListSelections = ref<any[]>([])

    /**
     * 清除所有选中
     */
    const clearSelection = () => {
        dataListSelections.value = []
        if (tableRef?.value) {
            tableRef.value.clearSelection()
        }
    }

    /**
     * 恢复当前页的选中状态（在数据刷新后调用）
     */
    const restoreCurrentPageSelection = () => {
        if (!tableRef?.value || !dataList?.value) {
            return
        }

        tableRef.value.clearSelection()

        const currentSelectRows: any[] = []
        dataList.value.forEach((item: any) => {
            const isSelected = dataListSelections.value.some(
                (selected: any) => selected[primaryKey] === item[primaryKey]
            )
            if (isSelected) {
                currentSelectRows.push(item)
            }
        })

        nextTick(() => {
            currentSelectRows.forEach((item: any) => {
                tableRef.value?.toggleRowSelection(item, true)
            })
        })
    }

    /**
     * 单页选择变化事件（Element Plus 的 selection-change 事件）
     * 注意：此事件只在当前页切换时触发，不包含全选/取消全选
     */
    const selectionChangeHandle = (selections: any[]) => {
        dataListSelections.value = selections.map((item: any) => item[primaryKey])
    }

    /**
     * 用户手动勾选/取消勾选行时触发（更精细的控制）
     * 会保留其他页的选中状态
     */
    const selectHandle = (selections: any[]) => {
        if (!dataList?.value) return

        // 1. 从已选列表中移除当前页的所有数据
        const currentPageKeys = dataList.value.map((item: any) => item[primaryKey])
        let newSelectedData = dataListSelections.value.filter((item: any) => {
            return !currentPageKeys.includes(item[primaryKey])
        })

        // 2. 将当前页的选中数据加入已选列表（去重）
        selections.forEach((item: any) => {
            const exists = newSelectedData.some(
                (selected: any) => selected[primaryKey] === item[primaryKey]
            )
            if (!exists) {
                newSelectedData.push(item)
            }
        })

        dataListSelections.value = newSelectedData
    }

    /**
     * 全选/取消全选事件（Element Plus 的 select-all 事件）
     */
    const selectAllHandle = (selections: any[]) => {
        if (!dataList?.value) return

        // 1. 从已选列表中移除当前页的所有数据
        const currentPageKeys = dataList.value.map((item: any) => item[primaryKey])
        let newSelectedData = dataListSelections.value.filter((item: any) => {
            return !currentPageKeys.includes(item[primaryKey])
        })

        // 2. 如果当前是全选状态（selections 有数据），则将当前页所有数据加入已选列表
        if (selections.length > 0) {
            dataList.value.forEach((item: any) => {
                const exists = newSelectedData.some(
                    (selected: any) => selected[primaryKey] === item[primaryKey]
                )
                if (!exists) {
                    newSelectedData.push(item)
                }
            })
        }

        dataListSelections.value = newSelectedData
    }

    /**
     * 获取当前已选中的主键数组
     */
    const getSelectedKeys = (): any[] => {
        return dataListSelections.value.map((item: any) => item[primaryKey])
    }

    /**
     * 获取当前已选中的完整数据
     */
    const getSelectedData = (): any[] => {
        return dataListSelections.value
    }

    /**
     * 检查某个数据是否被选中
     */
    const isSelected = (item: any): boolean => {
        return dataListSelections.value.some(
            (selected: any) => selected[primaryKey] === item[primaryKey]
        )
    }

    return {
        dataListSelections,
        clearSelection,
        restoreCurrentPageSelection,
        selectionChangeHandle,
        selectHandle,
        selectAllHandle,
        getSelectedKeys,
        getSelectedData,
        isSelected
    }
}
