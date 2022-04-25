const ContextHelper = {
  checkDataOnContext(data) {
    let shouldLoadData = false;
    if (!data || !Object.keys(data).length) {
      shouldLoadData = true;
    }
    return shouldLoadData;
  },
};
export default ContextHelper;
