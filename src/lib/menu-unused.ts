// What counts as "unused" on the menu pages. Shared by the Unused badges and the
// Unused filter so they always agree.

/** A menu item in no category isn't shown on the POS. */
export function isUnusedItem(item: MenuItem): boolean {
  return (item.categoryIds?.length ?? 0) === 0;
}

/** An option group no menu item uses. */
export function isUnusedOptionGroup(group: OptionGroup): boolean {
  return (group.itemIds?.length ?? 0) === 0;
}

/** An option in no option group. */
export function isUnusedOption(option: ItemOption): boolean {
  return (option.groupIds?.length ?? 0) === 0;
}
