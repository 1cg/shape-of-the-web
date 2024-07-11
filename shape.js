function computeStats() {
    let stats = {};

    stats.nodesCount = document.querySelector("*").length;

    stats.bodyNodesCount = document.querySelectorAll("body *").length
    let bodyLeafNodes = document.querySelectorAll("body :not(:has(*))");
    stats.bodyLeafNodesCount = bodyLeafNodes.length

    let depths = [];
    for (const leafNode of bodyLeafNodes) {
        depths.push(depthOf(leafNode));
    }
    depths.sort((a, b) => a - b);

    let meanDepth = mean(depths);
    let stdDevDepth = stddev(depths, meanDepth);
    let modeDepth = mode(depths);
    let skewDepth = skew(meanDepth, modeDepth, stdDevDepth);
    stats.depth = {
        mean: meanDepth,
        median: median(depths),
        mode: modeDepth,
        stddev : stdDevDepth,
        skew : skewDepth,
        range: range(depths),
    }

    let bodyNonLeafNodes = document.querySelectorAll("body :has(*)");
    stats.bodyNonLeafNodesCount = bodyNonLeafNodes.length
    let branchFactors = [];
    for (const nonLeafNode of bodyNonLeafNodes) {
        branchFactors.push(nonLeafNode.childNodes.length);
    }
    branchFactors.sort((a, b) => a - b);

    let meanBranchFactor = mean(branchFactors);
    let stdDevBranchFactor = stddev(branchFactors, meanBranchFactor);
    let modeBranchFactor = mode(branchFactors);
    let skewBranchFactor = skew(meanBranchFactor, modeBranchFactor, stdDevBranchFactor);
    stats.branchFactor = {
        mean: meanBranchFactor,
        median: median(branchFactors),
        mode: modeBranchFactor,
        stddev : stdDevBranchFactor,
        skew : skewBranchFactor,
        range: range(branchFactors),
    }

    stats.branchFactorByDepth = []
    for (let depth = 0; depth < stats.depth.range.max; depth++) {

        let selector = "body ";
        for (let i = 0; i < depth; i++) {
            selector += " > :has(*)";
        }
        let parentNodesAtThisLevel = document.querySelectorAll(selector);
        let branchFactors = [];
        for (const nonLeafNode of parentNodesAtThisLevel) {
            branchFactors.push(nonLeafNode.childNodes.length);
        }
        branchFactors.sort((a, b) => a - b);

        let meanBranchFactor = mean(branchFactors);
        let stdDevBranchFactor = stddev(branchFactors, meanBranchFactor);
        let modeBranchFactor = mode(branchFactors);
        let skewBranchFactor = skew(meanBranchFactor, modeBranchFactor, stdDevBranchFactor);
        stats.branchFactorByDepth[depth] = {
            count: parentNodesAtThisLevel.length,
            mean: meanBranchFactor,
            stddev : stdDevBranchFactor,
            skew : skewBranchFactor,
            median: median(branchFactors),
            mode: modeBranchFactor,
            range: range(branchFactors),
        }
    }

    return stats;


    //================================================================
    //  helpers
    //================================================================

    function depthOf(node, currentDepth = 0) {
        if (node === document.body) {
            return currentDepth;
        } else {
            return depthOf(node.parentNode, currentDepth + 1);
        }
    }

    function mean(arr) {
        let total = arr.reduce((acc, curr) => acc + curr, 0)
        return total / arr.length;
    }

    function stddev(arr, mean) {
        let squareDiffs = arr.map((k) => (k - mean) ** 2);
        let sumSquareDiffs = squareDiffs.reduce((acc, curr) => acc + curr, 0);
        return Math.sqrt(sumSquareDiffs / arr.length);
    }

    function skew(mean, mode, stdDev) {
        return (mean - mode) / stdDev;
    }

    function median(sortedArr) {
        let length = sortedArr.length;
        if (length % 2 === 0) {
            return (sortedArr[length / 2 - 1] + sortedArr[length / 2]) / 2;
        } else {
            return sortedArr[(length - 1) / 2];
        }
    }

    function mode(arr) {
        let mode = {};
        let max = 0, count = 0;
        for (const item of arr) {
            if (mode[item]) {
                mode[item]++;
            } else {
                mode[item] = 1;
            }
            if(count < mode[item]) {
                max = item;
                count = mode[item];
            }
        }
        return max
    }

    function range(sortedArr) {
        return {min: sortedArr[0], max: sortedArr[sortedArr.length - 1]};
    }

}
