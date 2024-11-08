<?php
/******************************************************************************\
|                                                                              |
|                       InstitutionUnitController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for fetching info about units.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use App\Models\Users\InstitutionUnit;
use App\Models\Users\User;
use App\Http\Controllers\Controller;
use App\Utilities\Filters\NameFilter;
use App\Utilities\Filters\InstitutionUnitFilter;
use App\Utilities\Filters\TopicFilter;
use App\Utilities\Filters\TermFilter;
use App\Utilities\Filters\CommunityFilter;
use App\Utilities\Filters\LimitFilter;

class InstitutionUnitController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get a unit.
	 *
	 * @param string $id - the id of the institution unit to get
	 * @return App\Models\InstitutionUnit
	 */
	public function getIndex(string $id) {

		// find institution unit by id
		//
		$institutionUnit = InstitutionUnit::find($id);
		if (!$institutionUnit) {
			return response("Institution unit not found.", 404);
		}

		return $institutionUnit;
	}

	/**
	 * Get all units.
	 *
	 * @return App\Models\InstitutionUnit[]
	 */
	public function getAll() {
		return InstitutionUnit::orderBy('name')->get();
	}

	/**
	 * Get all units with full info (num people and associates).
	 *
	 * @return App\Models\InstitutionUnit[]
	 */
	public function getFull() {
		return InstitutionUnit::orderBy('name')->get();
	}

	/**
	 * Get people belonging to this unit.
	 *
	 * @return App\Models\User[]
	 */
	public function getPeople(Request $request, $id) {
		$query = User::where('primary_unit_affiliation_id', '=', $id);

		// add filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = InstitutionUnitFilter::applyTo($request, $query);
		$query = TopicFilter::applyTo($request, $query);
		$query = TermFilter::applyTo($request, $query);
		$query = CommunityFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		return $query->get();
	}

	/**
	 * Get people affiliated with this unit.
	 *
	 * @return App\Models\User[]
	 */
	public function getAffiliates(Request $request, $id) {
		$query = User::where('nonPrimaryUnitAffiliationIds', 'like', '%' . $id . '%');

		// add filters
		//
		$query = NameFilter::applyTo($request, $query);
		$query = InstitutionUnitFilter::applyTo($request, $query);
		$query = TopicFilter::applyTo($request, $query);
		$query = TermFilter::applyTo($request, $query);
		$query = CommunityFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		return $query->get();
	}
}