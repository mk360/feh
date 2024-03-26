interface RotatingIconsImage {
    toggleIcons(): this;
    setIcons(icons: IconData[]): this;
    iconsList: IconData[];
};

export default RotatingIconsImage;
