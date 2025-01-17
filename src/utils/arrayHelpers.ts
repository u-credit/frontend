export const getUniqueSections = (sections: string[]): string[] => {
    return sections.filter((section, index, self) => section !== '' && self.indexOf(section) === index);
  };