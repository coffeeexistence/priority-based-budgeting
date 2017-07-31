
function priorityDistribution(priorityValues){
  // Get sum of priorityValues
  const priorityValueSum = priorityValues
    .reduce((sum, priorityValue) => (sum + priorityValue), 0); // 22
  // Get base unit
  const baseUnit = priorityValueSum / priorityValues.length; // 4.6
  // Map 
  return priorityValues.map((priorityValue) => 
    (baseUnit * priorityValue) / (priorityValueSum * baseUnit)
  );
}

function calculateAllocation(availableFunds, allocation) {
  const allocations = allocation.allocations;
  if(!allocations)
    return Object.assign({}, allocation, {allocated: availableFunds});
  
  const getResultsSum = results =>
    results.reduce((sum, res) => (res.allocated + sum), 0);
  
  const prioritized = [];
  const fixed = [];
  
  allocations.forEach(allocation => {
    if(allocation.priority === undefined) { fixed.push(allocation) }
    else { prioritized.push(allocation) }
  });
  
  const fixedResults = fixed.map(fixedResult =>
    calculateAllocation(fixedResult.allocated, fixedResult)
  );
  
  const amountRemaining = availableFunds - getResultsSum(fixedResults);
  
  const priorityValues = prioritized.map(p => p.priority);
  
  const prioritizedResults = priorityDistribution(priorityValues)
    .map(allocationPercentage => allocationPercentage * amountRemaining)
    .map((amount, i) => calculateAllocation(amount, prioritized[i]))
  
  const results = [...fixedResults, ...prioritizedResults];
  
  return Object.assign(
    {}, 
    allocation, 
    {results, availableFunds, allocated: getResultsSum(results)}
  );
}

const structure = {
  IncomeSource: {
    baseFunds: 250000,
    
    allocations: [
        // Funds with no priority, can be thought of as a pre-calculated allocation
        { allocated: 10000 },
        { allocated: 250 },
        // Funds can be allocated after a couple steps
        // 1. Calculate availableFunds via priority distribution
        // 2. Combine amount(availableFunds) of dynamic allocations with fixed allocations
        { priority: 1 },
        { priority: 1 },
        {
          priority: 2,
          allocations: [
            {allocated: 100},
            {priority: 1}
          ]
        },
      ]
      
  }
};

console.log(
  calculateAllocation(structure.IncomeSource.baseFunds, structure.IncomeSource)
);
