import json
from functools import reduce
import os

# after using midi-parser-js to convert midi to json
# based on investigation and documentation on midi format, each note has deltaTime
# to convert deltaTime to real time, simply divide by timeDivision * 2 (ex. 384 * 2)

with open(os.path.join(os.path.dirname(__file__), 'sabers_edge.json')) as f:
    data = json.load(f)

    print("json contains the following initial keys")
    for key, value in data.items():
        print(key)

    print("time division:", data["timeDivision"])

    def sum_delta_time(cur_sum, note):
        return cur_sum + int(note["deltaTime"])
    
    track = data['track'][-1]['event']
    sum_of_delta_time = reduce(sum_delta_time, track, 0)
    print("sum of track -> deltaTime:", sum_of_delta_time)

