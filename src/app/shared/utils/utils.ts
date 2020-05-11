
export const Utils = {
  initDataTable(id) {
    const dataTableInstance = ($('#' + id)as any).DataTable({
      'pagingType': 'full_numbers',
      'lengthMenu': [
        [10, 25, 50, -1],
        [10, 25, 50, 'All']
      ],
      responsive: false,
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search...',
      }
    });
  }
};
