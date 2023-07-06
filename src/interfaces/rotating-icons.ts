interface RotatingIconsImage {
    toggleIcons(): this;
    setIcons(icons: string[]): this;
    iconsList: string[];
};

export default RotatingIconsImage;
