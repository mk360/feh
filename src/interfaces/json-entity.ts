interface Component {
    type: string;
    [k: string]: any;
}

interface JSONEntity {
    id: string;
    tags: string[];
    components: Component[];
}