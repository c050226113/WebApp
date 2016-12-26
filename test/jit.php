<?php
function arraysSum(...$arrays){
    $aaa = function($array){
        return array_sum($array);
    };
    return array_map($aaa, $arrays);

}

print_r(arraysSum([1,2,3], [4,5,6], [7,8,9]));
